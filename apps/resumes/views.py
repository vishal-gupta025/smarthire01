from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from apps.accounts.models import candidateProfile
from .services.extract_text import extract_resume_text
from apps.accounts.serializers import CandidateProfileSerializer
from .models import Resume, ResumeAnalysis
from apps.accounts.permissions import IsCandidate
from apps.resumes.services.resume_parser import parse_resume_with_llm
from .throttles import ResumeUploadThrottle


class ResumeUploadView(APIView):
    permission_classes = [IsAuthenticated, IsCandidate]
    parser_classes = [MultiPartParser, FormParser]
    throttle_classes = [ResumeUploadThrottle]

    def post(self, request):
        try:
            profile = request.user.candidate_profile
        except candidateProfile.DoesNotExist:
            return Response({"error": "Candidate profile not found"}, status=status.HTTP_400_BAD_REQUEST)

        resume_file = request.FILES.get("resume")
        if not resume_file:
            return Response({"error": "Resume file required"}, status=status.HTTP_400_BAD_REQUEST)

        old_resumes = profile.resumes.all()
        for old_resume in old_resumes:
            if old_resume.file:
                old_resume.file.delete(save=False)  
            old_resume.delete() 

        resume = Resume.objects.create(candidate=profile, file=resume_file)

        resume_text = extract_resume_text(resume.file.path)

        parsed = parse_resume_with_llm(resume_text)

        profile.skills = ", ".join(parsed.skills)
        profile.education = "\n".join(
            f"{e.degree} at {e.institution} ({e.date_range})"
            for e in parsed.education if e.degree
        )
        profile.experience = "\n\n".join(
            f"{x.role} at {x.company} ({x.date_range})\n" +
            "\n".join(f"• {w}" for w in x.work_done)
            for x in parsed.experience if x.company
        )
        profile.save()

        # Save analysis
        analysis, _ = ResumeAnalysis.objects.update_or_create(
            resume=resume,
            defaults={
                "extracted_skills": ", ".join(parsed.skills),
                "extracted_education": profile.education,
                "extracted_experience": profile.experience                
            }
        )

        return Response(
            {
                "message": "Resume uploaded and parsed successfully",
                "resume_id": resume.id,
                "analysis": parsed.dict(),
                "profile": CandidateProfileSerializer(profile).data,
            },
            status=status.HTTP_201_CREATED,
        )