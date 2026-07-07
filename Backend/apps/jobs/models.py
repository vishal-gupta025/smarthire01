from django.db import models
from apps.accounts.models import recruiterProfile, candidateProfile

class Job(models.Model):
    recruiter = models.ForeignKey(
        recruiterProfile,
        on_delete=models.CASCADE,
        related_name='jobs'
    )
    title = models.CharField(max_length=255, help_text="Title of the job position")
    job_descriptions = models.TextField(blank=False, null=False, help_text="Job Description for the position")
    skills_required = models.TextField(blank=False, null=False, help_text="List of required skills")
    experience_required = models.IntegerField(help_text="Experience level required for the job")
    location = models.CharField(max_length=255, help_text="Job location")
    class JobType(models.TextChoices):
        FULL_TIME = 'FULL_TIME', 'Full Time'
        PART_TIME = 'PART_TIME', 'Part Time'
        INTERN = 'INTERN', 'Intern'
        REMOTE = 'REMOTE', 'Remote'
    job_type = models.CharField(
        max_length=20,
        choices=JobType.choices,
        default=JobType.FULL_TIME,
    )
        
    number_of_openings = models.IntegerField(blank=False, null=False, default=1, help_text="Number of openings for the job position")
    salary_min = models.IntegerField(default=0, null=False, blank=False, help_text="Minimum salary for the job position")
    salary_max = models.IntegerField(
        default=0,
        help_text="Maximum salary for the job position",
        null=False,
        blank=False,
    )
    posted_at = models.DateTimeField(auto_now_add=True)
    job_status = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class JobApplication(models.Model):
    STATUS_CHOICES = [
        ('applied', 'Applied'),
        ('under_review', 'Under Review'),
        ('interview_scheduled', 'Interview Scheduled'),
        ('offered', 'Offered'),
        ('rejected', 'Rejected')
    ]

    job = models.ForeignKey(
        Job,
        on_delete=models.CASCADE,
        related_name='applications'
    )
    candidate = models.ForeignKey(
        candidateProfile,
        on_delete=models.CASCADE,
        related_name='applications'
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='applied'
    )
    applied_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('job', 'candidate')      
