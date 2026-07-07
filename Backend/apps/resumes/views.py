from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
import logging
from apps.accounts.permissions import IsCandidate
from apps.accounts.models import candidateProfile
from .models import Resume
from .throttles import ResumeUploadThrottle
from .tasks import process_resume_task


logger = logging.getLogger(__name__)


class ResumeUploadView(APIView):
    permission_classes = [IsAuthenticated, IsCandidate]
    parser_classes = [MultiPartParser, FormParser]
    throttle_classes = [ResumeUploadThrottle]

    def post(self, request):
        try:
            profile = request.user.candidate_profile
        except candidateProfile.DoesNotExist:
            return Response(
                {"error": "Candidate profile not found"},
                status=status.HTTP_400_BAD_REQUEST
            )

        resume_file = request.FILES.get("resume")
        if not resume_file:
            return Response(
                {"error": "Resume file required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        profile.resumes.all().delete()

        resume = Resume.objects.create(
            candidate=profile,
            file=resume_file,
            status="PENDING"
        )

        try:
            process_resume_task.delay(resume.id)
        except Exception as exc:
            logger.warning("Resume processing task could not be queued for resume %s: %s", resume.id, exc)

        return Response(
            {
                "message": "Resume uploaded successfully. Processing started.",
                "resume_id": resume.id,
                "status": resume.status,
            },
            status=status.HTTP_202_ACCEPTED,
        )
