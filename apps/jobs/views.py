from django.http import Http404
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework import status

from apps.accounts.permissions import IsRecruiter
from .models import Job
from .serializers import JobSerializer

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

