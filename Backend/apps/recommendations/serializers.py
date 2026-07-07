from rest_framework.serializers import ModelSerializer

from .models import JobRecommendation


class JobRecommendationSerializer(ModelSerializer):
    class Meta:
        model = JobRecommendation
        fields = [
            "id",
            "candidate",
            "job",
            "score",
            "reason",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["created_at", "updated_at"]