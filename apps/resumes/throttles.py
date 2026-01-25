from rest_framework.throttling import UserRateThrottle

class ResumeUploadThrottle(UserRateThrottle):
    scope = 'upload_resume'