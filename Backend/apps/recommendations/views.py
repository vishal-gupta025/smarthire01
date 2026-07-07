from django.db import transaction

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from apps.accounts.models import candidateProfile
from apps.accounts.permissions import IsCandidate
from apps.jobs.models import Job
from apps.jobs.matching import recommend_jobs_for_candidate

from .models import JobRecommendation


class CandidateJobRecommendationsView(APIView):
	permission_classes = [IsAuthenticated, IsCandidate]

	def get(self, request):
		try:
			candidate = request.user.candidate_profile
		except candidateProfile.DoesNotExist:
			return Response(
				{"detail": "Candidate profile not found."},
				status=status.HTTP_404_NOT_FOUND,
			)

		limit = request.query_params.get("limit", 10)
		try:
			limit = max(1, min(int(limit), 50))
		except (TypeError, ValueError):
			limit = 10

		jobs = Job.objects.filter(job_status=True).select_related("recruiter")
		recommendations = recommend_jobs_for_candidate(candidate, jobs=jobs, limit=limit)

		results = []
		with transaction.atomic():
			for job, score, reason in recommendations:
				JobRecommendation.objects.update_or_create(
					candidate=candidate,
					job=job,
					defaults={"score": score, "reason": reason},
				)
				results.append(
					{
						"job_id": job.id,
						"title": job.title,
						"company_name": job.recruiter.company_name,
						"location": job.location,
						"job_type": job.get_job_type_display(),
						"skills_required": job.skills_required,
						"experience_required": job.experience_required,
						"salary_min": job.salary_min,
						"salary_max": job.salary_max,
						"score": score,
						"reason": reason,
					}
				)

		return Response(
			{"count": len(results), "results": results},
			status=status.HTTP_200_OK,
		)


