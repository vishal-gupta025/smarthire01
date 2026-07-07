from django.contrib import admin
from .models import User, candidateProfile, recruiterProfile
from apps.resumes.admin import ResumeInline

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'email', 'role', 'is_active', 'date_joined')
    search_fields = ('email', 'role')
    list_filter = ('role', 'is_active', 'date_joined')

@admin.register(candidateProfile)
class CandidateProfileAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'full_name', 'skills', 'experience', 'education', 'uploaded_at', 'updated_at')
    search_fields = ('user__email', 'full_name', 'skills')
    list_filter = ('experience', 'education')
    inlines = [ResumeInline]

@admin.register(recruiterProfile)
class RecruiterProfileAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'company_name', 'location', 'company_description')
    search_fields = ('user__email', 'company_name',)
    list_filter = ('location',)
