from django.db import models

from apps.accounts.models import candidateProfile
from apps.jobs.models import Job


class JobRecommendation(models.Model):
	candidate = models.ForeignKey(
		candidateProfile,
		on_delete=models.CASCADE,
		related_name="job_recommendations",
	)
	job = models.ForeignKey(
		Job,
		on_delete=models.CASCADE,
		related_name="recommendations",
	)
	score = models.FloatField(default=0)
	reason = models.TextField(blank=True)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	class Meta:
		ordering = ["-score", "-created_at"]
		unique_together = ("candidate", "job")

	def __str__(self):
		return f"{self.job.title} for {self.candidate.full_name}"
