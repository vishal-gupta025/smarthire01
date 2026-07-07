from django.contrib import admin

from .models import JobRecommendation


@admin.register(JobRecommendation)
class JobRecommendationAdmin(admin.ModelAdmin):
	list_display = ("candidate", "job", "score", "created_at")
	search_fields = ("candidate__full_name", "job__title", "job__recruiter__company_name")
	list_select_related = ("candidate", "job", "job__recruiter")
