from django.shortcuts import render
from .models import User, candidateProfile, recruiterProfile
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer, CandidateProfileSerializer, RecruiterProfileSerializer, LoginTokenSerializer
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.parsers import MultiPartParser, FormParser
from apps.accounts.permissions import IsCandidate, IsRecruiter

class RegisterView(APIView):   
    permission_classes = []

    def post(self, request):
        try:
            serializer = UserSerializer(data=request.data)
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
            if User.objects.filter(email=request.data.get('email')).exists():
                return Response(
                    {'error': 'Email is already registered.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            user = serializer.save()
            role = request.data.get('role', '').lower()
            
            if role == 'candidate':
                candidateProfile.objects.create(user=user)
            elif role == 'recruiter':
                recruiterProfile.objects.create(user=user)
            else:
                return Response(
                    {'error': 'Invalid role. Must be "candidate" or "recruiter".'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            return Response(
                {'message': 'User registered successfully.', 'data': serializer.data},
                status=status.HTTP_201_CREATED
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class LoginView(TokenObtainPairView):
    serializer_class = LoginTokenSerializer


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            if not refresh_token:
                return Response(
                    {"error": "Refresh token is required"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response(
                {"message": "Logged out successfully"},
                status=status.HTTP_205_RESET_CONTENT
            )
        except Exception as e:
            return Response(
                {"error": "Invalid or expired token"},
                status=status.HTTP_400_BAD_REQUEST
            )


class CandidateProfileView(APIView):
    permission_classes = [IsAuthenticated, IsCandidate]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request):
        try:
            profile = request.user.candidate_profile
            serializer = CandidateProfileSerializer(profile)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except candidateProfile.DoesNotExist:
            return Response(
                {'error': 'Candidate profile not found.'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
    def patch(self, request):
        try:
            profile = request.user.candidate_profile
            serializer = CandidateProfileSerializer(profile, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except candidateProfile.DoesNotExist:
            return Response(
                {'error': 'Candidate profile not found.'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )    
        
class RecruiterProfileView(APIView):
    permission_classes = [IsAuthenticated, IsRecruiter]

    def get(self, request):
        try:
            profile = request.user.recruiter_profile
            serializer = RecruiterProfileSerializer(profile)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except recruiterProfile.DoesNotExist:
            return Response(
                {'error': 'Recruiter profile not found.'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def post(self, request):
        try:
            profile = request.user.recruiter_profile
            serializer = RecruiterProfileSerializer(profile, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except recruiterProfile.DoesNotExist:
            return Response(
                {'error': 'Recruiter profile not found.'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
