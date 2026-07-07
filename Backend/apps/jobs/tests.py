from django.contrib.auth import get_user_model
from django.test import TestCase
from unittest.mock import patch

from rest_framework.test import APIRequestFactory, force_authenticate

from apps.accounts.models import candidateProfile, recruiterProfile
from .models import Job
from .views import JobListCreateView


User = get_user_model()


class JobListCreateViewTests(TestCase):
	def setUp(self):
		self.factory = APIRequestFactory()

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

		candidate_user = User.objects.create_user(
			email="candidate@example.com",
			password="password123",
			role="CANDIDATE",
		)
		candidateProfile.objects.create(
			user=candidate_user,
			full_name="Jane Candidate",
			skills="Python, Django",
		)

	@patch("apps.jobs.views.send_email_on_job_creations.delay")
	def test_job_create_triggers_email_notifications(self, mock_delay):
		request = self.factory.post(
			"/api/jobs/",
			{
				"title": "Django Developer",
				"job_descriptions": "Build APIs",
				"skills_required": "Python, Django",
				"experience_required": 2,
				"location": "Remote",
				"job_type": "FULL_TIME",
				"number_of_openings": 1,
				"salary_min": 1000,
				"salary_max": 2000,
				"job_status": True,
			},
			format="json",
		)
		force_authenticate(request, user=self.recruiter_profile.user)

		response = JobListCreateView.as_view()(request)

		self.assertEqual(response.status_code, 201)
		self.assertEqual(Job.objects.count(), 1)
		mock_delay.assert_called_once()
		_, kwargs = mock_delay.call_args
		self.assertEqual(kwargs["candidate_emails"], ["candidate@example.com"])
		self.assertEqual(kwargs["job_title"], "Django Developer")
