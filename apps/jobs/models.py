from django.db import models
from apps.accounts.models import recruiterProfile

class Job(models.Model):
    recruiter = models.ForeignKey(
        recruiterProfile,
        on_delete=models.CASCADE,
        related_name='jobs'
    )
    title = models.CharField(max_length=255, help_text="Title of the job position")
    job_descriptions = models.TextField(blank=True, null=True, help_text="Job Description for the position")
    skills_required = models.TextField(blank=True, null=True, help_text="List of required skills")
    experience_required = models.IntegerField(help_text="Experience level required for the job")
    location = models.CharField(max_length=255, help_text="Job location")
    number_of_openings = models.IntegerField(default=1, help_text="Number of openings for the job position")
    salary_min = models.IntegerField(null=True, blank=True, help_text="Minimum salary for the job position")
    salary_max = models.IntegerField(
        help_text="Maximum salary for the job position",
        null=True,
        blank=True,
    )
    posted_at = models.DateTimeField(auto_now_add=True)
    job_status = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title