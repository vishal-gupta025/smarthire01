from django.urls import path
from . import views

urlpatterns = [
    path('', views.JobListCreateView.as_view(), name='job-list-create'),
    path('<int:pk>/', views.JobDetailView.as_view(), name='job-detail'),
    path('<int:job_id>/apply/', views.JobApplyView.as_view(), name='job-apply'),
    path('<int:job_id>/applications/', views.JobApplicationView.as_view(), name='job-applications'),
    path('recruiter/applications/<int:application_id>/status/', views.JobApplicationStatusUpdateView.as_view(), name='application-detail'),
    path('candidate/applications/', views.CandidateApplicationsView.as_view(), name='candidate-applications'),


]
