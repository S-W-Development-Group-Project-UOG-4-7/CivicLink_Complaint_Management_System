from rest_framework import permissions

class IsOfficer(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and hasattr(request.user, 'officer_profile'))

class IsAuthenticatedOrCitizenNIC(permissions.BasePermission):
    """
    Allows unauthenticated POST (public complaint creation with NIC). Officers must be authenticated for other actions.
    """
    def has_permission(self, request, view):
        if request.method == 'POST':
            return True
        return bool(request.user and request.user.is_authenticated)
