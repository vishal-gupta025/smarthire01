from django.db import models
from django.contrib.auth.models import AbstractUser
from .manager import CustomUserManager


class User(AbstractUser):
    username = None

    class Role(models.TextChoices):
        ADMIN = 'ADMIN', 'Admin'
        Candidate = 'CANDIDATE', 'Candidate'
        RECRUITER = 'RECRUITER', 'Recruiter'

    
    email = models.EmailField(unique=True)
    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.Candidate,
    )

    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return self.email



class candidateProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='candidate_profile')
    full_name = models.CharField(max_length=255, blank=True)
    skills = models.JSONField(blank=True, null=True, default=list, verbose_name="Skills (comma separated values)")
    experience = models.TextField(blank=True)
    education = models.TextField(blank=True)
    resume = models.FileField(upload_to='resumes/', blank=True, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.full_name
    
    def save(self, *args, **kwargs):
        if isinstance(self.skills, str):
            tokens = [item.strip() for item in self.skills.split(',') if item.strip()]
            self.skills = tokens
        if not self.skills:
            self.skills = []
        super().save(*args, **kwargs)
    
class recruiterProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='recruiter_profile')
    company_name = models.CharField(max_length=255, blank=True)
    location = models.CharField(max_length=255, blank=True)
    company_description = models.TextField(blank=True)
    job_descriptions = models.FileField(upload_to='job_descriptions/', blank=True, null=True, verbose_name="job Descriptiona must include job title, responsibilities, qualifications, benefits, locations etc.")
    uploaded_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    def __str__(self):
        return self.company_name

