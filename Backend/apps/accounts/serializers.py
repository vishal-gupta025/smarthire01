from rest_framework import serializers
from .models import User, candidateProfile, recruiterProfile
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class LoginTokenSerializer(TokenObtainPairSerializer):
    username_field = 'email'

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['email'] = user.email
        token['role'] = user.role
        return token

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
    
    def validate_role(self, value):
        # Normalize role to uppercase so "candidate"/"recruiter" are accepted
        if isinstance(value, str):
            return value.upper()
        return value
    

class CandidateProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    skills = serializers.CharField(required=False, allow_blank=True)
    experience = serializers.CharField(required=False, allow_blank=True)
    education = serializers.CharField(required=False, allow_blank=True)
    current_resume_id = serializers.SerializerMethodField()
    current_resume_url = serializers.SerializerMethodField()
    current_resume_name = serializers.SerializerMethodField()
    current_resume_status = serializers.SerializerMethodField()
    current_resume_uploaded_at = serializers.SerializerMethodField()

    class Meta:
        model = candidateProfile
        fields = [
            'id',
            'user',
            'full_name',
            'skills',
            'experience',
            'education',
            'current_resume_id',
            'current_resume_url',
            'current_resume_name',
            'current_resume_status',
            'current_resume_uploaded_at',
            'uploaded_at',
            'updated_at',
        ]
        read_only_fields = ['uploaded_at', 'updated_at']

    def _get_latest_resume(self, obj):
        return obj.resumes.order_by('-uploaded_at').first()

    def get_current_resume_id(self, obj):
        resume = self._get_latest_resume(obj)
        return resume.id if resume else None

    def get_current_resume_url(self, obj):
        resume = self._get_latest_resume(obj)
        if not resume:
            return None

        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(resume.file.url)

        return resume.file.url

    def get_current_resume_name(self, obj):
        resume = self._get_latest_resume(obj)
        return resume.file.name.split('/')[-1] if resume else None

    def get_current_resume_status(self, obj):
        resume = self._get_latest_resume(obj)
        return resume.status if resume else None

    def get_current_resume_uploaded_at(self, obj):
        resume = self._get_latest_resume(obj)
        return resume.uploaded_at if resume else None
        

class RecruiterProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    job_descriptions = serializers.FileField(required=False)

    class Meta:
        model = recruiterProfile
        fields = ['id', 'user', 'company_name', 'location', 'company_description', 'job_descriptions', 'uploaded_at', 'updated_at']
