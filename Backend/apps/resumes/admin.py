from django.contrib import admin
from .models import Resume, ResumeAnalysis

class ResumeAnalysisInline(admin.StackedInline):
    model = ResumeAnalysis
    extra = 0

class ResumeInline(admin.StackedInline):
    model = Resume
    extra = 0
    list_display = ('candidate', 'status', 'uploaded_at', 'updated_at')
    show_change_link = True

@admin.register(Resume)
class ResumeAdmin(admin.ModelAdmin):
    list_display = ('candidate', 'status', 'uploaded_at', 'updated_at')
    inlines = [ResumeAnalysisInline]

    def has_add_permission(self, request):
        return False   

    def has_change_permission(self, request, obj=None):
        return True    
