from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import login, logout
from django.utils import timezone
from django.db.models import Count, Q
from datetime import timedelta
import uuid

from .models import AdminUser, Officer, AdminSession
from .serializers import AdminLoginSerializer, AdminUserSerializer, OfficerSerializer, OfficerRegistrationSerializer
from complaints.models import Complaint


class AdminLoginView(generics.GenericAPIView):
    serializer_class = AdminLoginSerializer
    permission_classes = [permissions.AllowAny]
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = serializer.validated_data['user']
        
        # Create session token
        session_token = str(uuid.uuid4())
        expires_at = timezone.now() + timedelta(hours=24)
        
        # Deactivate old sessions
        AdminSession.objects.filter(user=user, is_active=True).update(is_active=False)
        
        # Create new session
        session = AdminSession.objects.create(
            user=user,
            session_token=session_token,
            expires_at=expires_at
        )
        
        # Log in the user
        login(request, user)
        
        # Get user data
        user_serializer = AdminUserSerializer(user)
        
        return Response({
            'message': 'Login successful',
            'user': user_serializer.data,
            'session_token': session_token,
            'expires_at': expires_at
        }, status=status.HTTP_200_OK)


class AdminLogoutView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, *args, **kwargs):
        # Deactivate user sessions
        AdminSession.objects.filter(user=request.user, is_active=True).update(is_active=False)
        
        logout(request)
        
        return Response({
            'message': 'Logout successful'
        }, status=status.HTTP_200_OK)


class AdminDashboardView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, *args, **kwargs):
        # Get dashboard statistics
        total_complaints = Complaint.objects.count()
        pending_complaints = Complaint.objects.filter(status='pending').count()
        resolved_complaints = Complaint.objects.filter(status='resolved').count()
        total_officers = Officer.objects.filter(is_active=True).count()
        
        # Get recent complaints
        recent_complaints = Complaint.objects.order_by('-created_at')[:10]
        recent_complaints_data = []
        
        for complaint in recent_complaints:
            recent_complaints_data.append({
                'id': complaint.id,
                'title': complaint.title,
                'description': complaint.description[:100] + '...' if len(complaint.description) > 100 else complaint.description,
                'status': complaint.status,
                'priority': complaint.priority,
                'created_at': complaint.created_at,
                'citizen_name': complaint.citizen_name,
                'department': complaint.department.name if complaint.department else None
            })
        
        # Get complaints by status for chart
        complaints_by_status = Complaint.objects.values('status').annotate(count=Count('id'))
        
        # Get complaints by department for chart
        complaints_by_department = Complaint.objects.values('department__name').annotate(count=Count('id'))
        
        return Response({
            'statistics': {
                'total_complaints': total_complaints,
                'pending_complaints': pending_complaints,
                'resolved_complaints': resolved_complaints,
                'total_officers': total_officers,
            },
            'recent_complaints': recent_complaints_data,
            'charts': {
                'complaints_by_status': list(complaints_by_status),
                'complaints_by_department': list(complaints_by_department)
            }
        }, status=status.HTTP_200_OK)


class OfficerListView(generics.ListCreateAPIView):
    queryset = Officer.objects.all()
    serializer_class = OfficerSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = Officer.objects.select_related('user', 'department')
        
        # Filter by department if provided
        department_id = self.request.query_params.get('department')
        if department_id:
            queryset = queryset.filter(department_id=department_id)
        
        # Filter by active status if provided
        is_active = self.request.query_params.get('is_active')
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')
        
        return queryset


class OfficerDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Officer.objects.all()
    serializer_class = OfficerSerializer
    permission_classes = [IsAuthenticated]


class OfficerRegistrationView(generics.CreateAPIView):
    serializer_class = OfficerRegistrationSerializer
    permission_classes = [IsAuthenticated]
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        officer = serializer.save()
        
        return Response({
            'message': 'Officer registered successfully',
            'officer': OfficerSerializer(officer).data
        }, status=status.HTTP_201_CREATED)


class AdminProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = AdminUserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return self.request.user
