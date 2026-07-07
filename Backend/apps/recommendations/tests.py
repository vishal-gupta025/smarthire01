from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIRequestFactory, force_authenticate

from apps.accounts.models import candidateProfile, recruiterProfile
from apps.jobs.models import Job

from .models import JobRecommendation
from .views import CandidateJobRecommendationsView


User = get_user_model()


class CandidateJobRecommendationsViewTests(TestCase):
	def setUp(self):
		self.factory = APIRequestFactory()
		self.user = User.objects.create_user(
			email="candidate@example.com",
			password="password123",
			role="CANDIDATE",
		)
		self.candidate_profile = candidateProfile.objects.create(
			user=self.user,
			full_name="Jane Candidate",
			skills="Python, Django, REST",
		)
		recruiter_user = User.objects.create_user(
			email="recruiter@example.com",
			password="password123",
			role="RECRUITER",
		)
		self.recruiter_profile = recruiterProfile.objects.create(
			user=recruiter_user,
			company_name="Acme Inc",
			location="Remote",
			company_description="Hiring team",
		)
		self.matching_job = Job.objects.create(
			recruiter=self.recruiter_profile,
			title="Django Developer",
			job_descriptions="Build APIs",
			skills_required="Python, Django",
			experience_required=2,
			location="Remote",
			salary_min=1000,
			salary_max=2000,
		)
		self.non_matching_job = Job.objects.create(
			recruiter=self.recruiter_profile,
			title="Designer",
			job_descriptions="Design systems",
			skills_required="Figma, Branding",
			experience_required=2,
			location="Remote",
			salary_min=1000,
			salary_max=2000,
		)

	def test_candidate_receives_ranked_recommendations(self):
		request = self.factory.get("/api/recommendations/candidate/")
		force_authenticate(request, user=self.user)

		response = CandidateJobRecommendationsView.as_view()(request)

		self.assertEqual(response.status_code, 200)
		self.assertEqual(response.data["count"], 1)
		self.assertEqual(response.data["results"][0]["job_id"], self.matching_job.id)
		self.assertTrue(
			JobRecommendation.objects.filter(
				candidate=self.candidate_profile,
				job=self.matching_job,
			).exists()
		)
