from rest_framework.permissions import BasePermission

class IsCandidate(BasePermission):
    """
    Allows access only to users with role = CANDIDATE
    """

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == 'CANDIDATE'
        )
    
class IsRecruiter(BasePermission):
    """
    Allows access only to users with role = RECRUITER
    """

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == 'RECRUITER'
        )
    
class IsAdmin(BasePermission):
    """
    Allows access only to users with role = ADMIN
    """

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == 'ADMIN'
        )