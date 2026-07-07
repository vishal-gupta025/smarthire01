import logging
import threading

from django.http import Http404
from django.db import transaction

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework import status

from apps.accounts.permissions import IsRecruiter, IsCandidate
from .models import Job
from .serializers import JobSerializer
from apps.accounts.models import candidateProfile, recruiterProfile
from .models import JobApplication
from .tasks import send_application_email, send_status_update_email, send_email_on_job_creations
from .matching import find_matching_candidate_emails_for_job


logger = logging.getLogger(__name__)


def _publish_celery_task(task, **kwargs):
    def runner():
        try:
            task.apply_async(kwargs=kwargs)
        except Exception as exc:
            logger.warning("Failed to publish Celery task %s: %s", task.name, exc)

    threading.Thread(target=runner, daemon=True).start()

class JobListCreateView(APIView):
    permission_classes = [IsAuthenticated, IsRecruiter]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    """
    View to list all jobs and create a new job.
    """
    def get(self, request):
        recruiter_profile = getattr(request.user, 'recruiter_profile', None)
        if recruiter_profile is None:
            return Response(
                {"detail": "Recruiter profile not found for the current user."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        jobs = Job.objects.filter(recruiter=recruiter_profile).order_by('-posted_at')
        serializer = JobSerializer(jobs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        recruiter_profile = getattr(request.user, 'recruiter_profile', None)
        if recruiter_profile is None:
            return Response(
                {"detail": "Recruiter profile not found for the current user."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = JobSerializer(data=request.data)
        if serializer.is_valid():
            job = serializer.save(recruiter=recruiter_profile)
            candidate_emails = find_matching_candidate_emails_for_job(job)
            if candidate_emails:
                transaction.on_commit(
                    lambda: _publish_celery_task(
                        send_email_on_job_creations,
                        candidate_emails=candidate_emails,
                        job_title=job.title,
                        company_name=job.recruiter.company_name,
                        salery_min=job.salary_min,
                        salery_max=job.salary_max,
                        location=job.location,
                    )
                )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class JobDetailView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get(self, request, pk):
        # Allow candidates to view active jobs and recruiters to view their own jobs
        recruiter_profile = getattr(request.user, 'recruiter_profile', None)
        try:
            if recruiter_profile is not None:
                job = Job.objects.get(pk=pk, recruiter=recruiter_profile)
            else:
                # Candidate or other authenticated user: only allow active jobs
                job = Job.objects.get(pk=pk, job_status=True)
        except Job.DoesNotExist:
            return Response({"detail": "Job not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = JobSerializer(job)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def _get_recruiter_owned_job(self, request, pk):
        recruiter_profile = getattr(request.user, 'recruiter_profile', None)
        if recruiter_profile is None:
            return None
        try:
            return Job.objects.get(pk=pk, recruiter=recruiter_profile)
        except Job.DoesNotExist:
            return None

    def put(self, request, pk):
        job = self._get_recruiter_owned_job(request, pk)
        if job is None:
            return Response({"detail": "Job not found or permission denied."}, status=status.HTTP_403_FORBIDDEN)
        serializer = JobSerializer(job, data=request.data, partial=False)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk):
        job = self._get_recruiter_owned_job(request, pk)
        if job is None:
            return Response({"detail": "Job not found or permission denied."}, status=status.HTTP_403_FORBIDDEN)
        serializer = JobSerializer(job, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        job = self._get_recruiter_owned_job(request, pk)
        if job is None:
            return Response({"detail": "Job not found or permission denied."}, status=status.HTTP_403_FORBIDDEN)
        job.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class JobApplyView(APIView):
    permission_classes = [IsAuthenticated, IsCandidate]

    def post(self, request, job_id):
        try:
            job = Job.objects.get(id=job_id, job_status=True)
        except Job.DoesNotExist:
            return Response({"detail": "Job not found."}, status=status.HTTP_404_NOT_FOUND)

        candidate, _ = candidateProfile.objects.get_or_create(user=request.user)
        if JobApplication.objects.filter(job=job, candidate=candidate).exists():
            return Response({"detail": "You have already applied for this job."}, status=status.HTTP_400_BAD_REQUEST)
        JobApplication.objects.create(job=job, candidate=candidate)
        _publish_celery_task(
            send_application_email,
            candidate_email=candidate.user.email,
            job_title=job.title,
            company_name=job.recruiter.company_name,
        )
        return Response({"detail": "Application submitted successfully."}, status=status.HTTP_201_CREATED)  

    
class JobApplicationView(APIView):
    permission_classes = [IsAuthenticated, IsRecruiter]

    def get(self, request, job_id):
        recruiter = request.user.recruiter_profile
        try:
            job = Job.objects.get(id=job_id, recruiter=recruiter)
        except Job.DoesNotExist:
            return Response({"detail": "Job not found."}, status=status.HTTP_404_NOT_FOUND)
        applications = JobApplication.objects.filter(job=job)

        data = []

        for app in applications:
            candidate = app.candidate
            # Get the latest resume for this candidate
            latest_resume = candidate.resumes.order_by('-uploaded_at').first()
            data.append({
                "application_id": app.id,
                "candidate_name": candidate.full_name,
                "skills": candidate.skills,
                "experience": candidate.experience,
                "education": candidate.education,
                "resume": latest_resume.file.url if latest_resume else None,
                "status": app.status,
                "applied_at": app.applied_at,
            })
        return Response(data, status=status.HTTP_200_OK)
    
class JobApplicationStatusUpdateView(APIView):
    permission_classes = [IsAuthenticated, IsRecruiter]

    def patch(self, request, application_id):
        recruiter = request.user.recruiter_profile
        raw_status = request.data.get('status')
        new_status = (raw_status or '').strip().lower()

        # Keep API backward-compatible with frontend wording.
        if new_status == 'accepted':
            new_status = 'offered'

        if new_status not in dict(JobApplication.STATUS_CHOICES):
            return Response({"detail": "Invalid status."}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            application = JobApplication.objects.select_related("job").get(id=application_id)
        except JobApplication.DoesNotExist:
            return Response({"detail": "Application not found."}, status=status.HTTP_404_NOT_FOUND)
        
        if application.job.recruiter != recruiter:
            return Response({"detail": "You do not have permission to update this application."}, status=status.HTTP_403_FORBIDDEN)
        old_status = application.status
        if old_status == new_status:
            return Response({"detail": "The application already has this status."}, status=status.HTTP_400_BAD_REQUEST)
        application.status = new_status
        application.save()
        _publish_celery_task(
            send_status_update_email,
            candidate_email=application.candidate.user.email,
            job_title=application.job.title,
            company_name=application.job.recruiter.company_name,
            new_status=new_status,
        )
        return Response({"detail": "Application status updated successfully."}, status=status.HTTP_200_OK)
    
class CandidateApplicationsView(APIView):
    permission_classes = [IsAuthenticated, IsCandidate]

    def get(self, request):
        candidate = request.user.candidate_profile
        status_filter = request.query_params.get('status')
        applications = JobApplication.objects.select_related("job", "job__recruiter").filter(candidate=candidate)

        if status_filter:
            applications = applications.filter(status=status_filter)

        applications = applications.order_by('-applied_at')

        data = []
        for app in applications:
            data.append({
                 "application_id": app.id,
                "job_id": app.job.id,
                "job_title": app.job.title,
                "company_name": app.job.recruiter.company_name,
                "job_type": app.job.get_job_type_display(),
                "status": app.status,
                "applied_at": app.applied_at,
            })
        return Response({
            "total_applications": applications.count(),
            "applications": data
        }, status=status.HTTP_200_OK)



