from django.http import Http404

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
from .tasks import send_application_email, send_status_update_email

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
            serializer.save(recruiter=recruiter_profile)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class JobDetailView(APIView):
    permission_classes = [IsAuthenticated, IsRecruiter]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_object(self, request, pk):
        recruiter_profile = getattr(request.user, 'recruiter_profile', None)
        if recruiter_profile is None:
            raise Http404("Recruiter profile not found for the current user.")

        try:
            return Job.objects.get(pk=pk, recruiter=recruiter_profile)
        except Job.DoesNotExist as exc:
            raise Http404("Job not found.") from exc

    def get(self, request, pk):
        job = self.get_object(request, pk)
        serializer = JobSerializer(job)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        job = self.get_object(request, pk)
        serializer = JobSerializer(job, data=request.data, partial=False)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk):
        job = self.get_object(request, pk)
        serializer = JobSerializer(job, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        job = self.get_object(request, pk)
        job.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class JobApplyView(APIView):
    permission_classes = [IsAuthenticated, IsCandidate]

    def post(self, request, job_id):
        candidate = candidateProfile.objects.get(user=request.user)
        try:
            job = Job.objects.get(id=job_id, job_status=True)
        except Job.DoesNotExist:
            return Response({"detail": "Job not found."}, status=status.HTTP_404_NOT_FOUND)
        if JobApplication.objects.filter(job=job, candidate=candidate).exists():
            return Response({"detail": "You have already applied for this job."}, status=status.HTTP_400_BAD_REQUEST)
        JobApplication.objects.create(job=job, candidate=candidate)
        send_application_email.delay(
            candidate_email=candidate.user.email,
            job_title=job.title,
            company_name=job.recruiter.company_name
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
        new_status = request.data.get('status')
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
        send_status_update_email.delay(
            candidate_email=application.candidate.user.email,
            job_title=application.job.title,
            company_name=application.job.recruiter.company_name,
            new_status=new_status
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



