from django.contrib import admin
from .models import User, candidateProfile, recruiterProfile

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'email', 'role', 'is_active', 'date_joined')
    search_fields = ('email', 'role')
    list_filter = ('role', 'is_active', 'date_joined')

@admin.register(candidateProfile)
class CandidateProfileAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'full_name', 'skills', 'experience', 'education', 'resume')
    search_fields = ('user__email', 'full_name', 'skills')
    list_filter = ('experience', 'education')

@admin.register(recruiterProfile)
class RecruiterProfileAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'company_name', 'location', 'company_description', 'job_descriptions')
    search_fields = ('user__email', 'company_name',)
    list_filter = ('location',)