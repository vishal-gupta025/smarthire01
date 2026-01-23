from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from apps.accounts.permissions import IsCandidate
from apps.jobs.models import Job

class HomeView(APIView):
    permission_classes = [IsAuthenticated, IsCandidate]

    def get(self, request):
        jobs = Job.objects.filter(job_status=True).order_by('-posted_at')
        if not jobs.exists():
            return Response({"message": "No active jobs available at the moment."}, status=status.HTTP_200_OK)
        job_list = [
            {
                "title": job.title,
                "job_descriptions": job.job_descriptions,
                "skills_required": job.skills_required,
                "experience_required": job.experience_required,
                "location": job.location,
                "job_status": job.job_status,
                "number_of_openings": job.number_of_openings,
                "salary_min": job.salary_min,
                "salary_max": job.salary_max,
                "posted_at": job.posted_at,
            }
            for job in jobs
        ]
        return Response(job_list, status=status.HTTP_200_OK)