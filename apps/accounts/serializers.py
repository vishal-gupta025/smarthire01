from rest_framework import serializers
from .models import User, candidateProfile, recruiterProfile
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class LoginTokenSerializer(TokenObtainPairSerializer):
    username_field = 'email'

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    class Meta:
        model = User
        fields = ['id', 'email', 'role', 'is_active', 'date_joined', 'password']

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        return user
    

class CandidateProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    skills = serializers.CharField(required=False, allow_blank=True)
    experience = serializers.CharField(required=False, allow_blank=True)
    education = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = candidateProfile
        fields = ['id', 'user', 'full_name', 'skills', 'experience', 'education', 'uploaded_at', 'updated_at']
        read_only_fields = ['uploaded_at', 'updated_at']
        

class RecruiterProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    job_descriptions = serializers.FileField(required=False)

    class Meta:
        model = recruiterProfile
        fields = ['id', 'user', 'company_name', 'location', 'company_description', 'job_descriptions', 'uploaded_at', 'updated_at']
