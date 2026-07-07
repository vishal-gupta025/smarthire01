from django.urls import path

from .views import CandidateJobRecommendationsView


urlpatterns = [
    path("candidate/", CandidateJobRecommendationsView.as_view(), name="candidate-recommendations"),
]