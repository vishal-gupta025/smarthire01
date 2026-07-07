from django.contrib import admin
from .models import Job

@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'title',
        'job_descriptions',
        'skills_required',
        'experience_required',
        'location',
        'number_of_openings',
        'salary_min',
        'salary_max',
        'posted_at',
        'job_status'
    )
    search_fields = ('title', 'location', 'skills_required')
    list_filter = ('job_status', 'posted_at', 'experience_required')
    readonly_fields = ('posted_at', 'updated_at')
