from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from apps.accounts.permissions import IsCandidate
from apps.jobs.models import Job
from apps.jobs.serializers import JobSerializer
from apps.jobs.filters import JobFilter

class HomeView(ListAPIView):
    permission_classes = [IsAuthenticated, IsCandidate]
    serializer_class = JobSerializer
    filterset_class = JobFilter

    search_fields = [
        "title",
        "skills_required",
        "job_descriptions",
        "location",
        "job_type",
    ]

    ordering_fields = [
        "posted_at",
        "salary_min",
        "salary_max",
        "experience_required",
    ]
    ordering = ["-posted_at"]

    def get_queryset(self):
        return Job.objects.filter(job_status=True)
