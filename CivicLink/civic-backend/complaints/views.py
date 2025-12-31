from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action, permission_classes, api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.db.models import Count, Q
from .models import User, Department, Officer, Complaint, ComplaintPhoto
from .serializers import (
    UserSerializer, DepartmentSerializer, OfficerSerializer, 
    ComplaintSerializer, ComplaintCreateSerializer, ComplaintUpdateSerializer,
    ComplaintPhotoSerializer, DepartmentStatsSerializer
)


# Authentication Views
@csrf_exempt
@require_http_methods(["POST"])
def admin_login(request):
    """Admin login endpoint"""
    username = request.POST.get('username')
    password = request.POST.get('password')
    
    if not username or not password:
        return JsonResponse({'error': 'Username and password required'}, status=400)
    
    user = authenticate(username=username, password=password)
    
    if user is not None and user.user_type == 'admin':
        login(request, user)
        return JsonResponse({
            'success': True,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'full_name': user.get_full_name(),
                'user_type': user.user_type
            }
        })
    else:
        return JsonResponse({'error': 'Invalid credentials or insufficient permissions'}, status=401)


@csrf_exempt
@require_http_methods(["POST"])
def officer_login(request):
    """Officer login endpoint"""
    username = request.POST.get('username')
    password = request.POST.get('password')
    
    if not username or not password:
        return JsonResponse({'error': 'Username and password required'}, status=400)
    
    user = authenticate(username=username, password=password)
    
    if user is not None and user.user_type == 'officer':
        try:
            officer = Officer.objects.get(user=user, is_active=True)
            login(request, user)
            return JsonResponse({
                'success': True,
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'full_name': user.get_full_name(),
                    'user_type': user.user_type,
                    'officer_type': officer.officer_type,
                    'department_id': officer.department.id if officer.department else None,
                    'department_name': officer.department.name if officer.department else None,
                    'badge_number': officer.badge_number
                }
            })
        except Officer.DoesNotExist:
            return JsonResponse({'error': 'Officer profile not found or inactive'}, status=403)
    else:
        return JsonResponse({'error': 'Invalid credentials'}, status=401)


def admin_logout(request):
    """Logout endpoint"""
    logout(request)
    return JsonResponse({'success': True})


# Admin ViewSets
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]
    
    def get_queryset(self):
        queryset = User.objects.all()
        user_type = self.request.query_params.get('user_type')
        if user_type:
            queryset = queryset.filter(user_type=user_type)
        return queryset
    
    @action(detail=False, methods=['post'])
    def register_officer(self, request):
        """Register a new officer"""
        data = request.data.copy()
        data['user_type'] = 'officer'
        
        user_serializer = UserSerializer(data=data)
        if user_serializer.is_valid():
            user = user_serializer.save()
            
            # Create officer profile
            officer_data = {
                'user': user.id,
                'department': data.get('department'),
                'officer_type': data.get('officer_type', 'department'),
                'badge_number': data.get('badge_number', f"OFF{user.id:04d}")
            }
            
            officer = Officer.objects.create(**officer_data)
            
            return Response({
                'user': user_serializer.data,
                'officer': OfficerSerializer(officer).data
            }, status=status.HTTP_201_CREATED)
        
        return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get department statistics"""
        stats = []
        for department in Department.objects.all():
            complaints = Complaint.objects.filter(department=department)
            stats_data = {
                'department_name': department.name,
                'icon': department.icon,
                'total_complaints': complaints.count(),
                'new_complaints': complaints.filter(status='New').count(),
                'in_progress_complaints': complaints.filter(status='In Progress').count(),
                'resolved_complaints': complaints.filter(status='Resolved').count(),
                'high_priority_complaints': complaints.filter(priority='High').count(),
            }
            stats.append(stats_data)
        
        serializer = DepartmentStatsSerializer(stats, many=True)
        return Response(serializer.data)


class OfficerViewSet(viewsets.ModelViewSet):
    queryset = Officer.objects.all()
    serializer_class = OfficerSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = Officer.objects.select_related('user', 'department')
        officer_type = self.request.query_params.get('officer_type')
        department_id = self.request.query_params.get('department_id')
        
        if officer_type:
            queryset = queryset.filter(officer_type=officer_type)
        if department_id:
            queryset = queryset.filter(department_id=department_id)
        
        return queryset


class ComplaintViewSet(viewsets.ModelViewSet):
    queryset = Complaint.objects.select_related('user', 'department', 'verification_officer', 'department_officer').prefetch_related('photos')
    serializer_class = ComplaintSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = Complaint.objects.all()
        user = self.request.user
        
        # Filter based on user type
        if user.user_type == 'citizen':
            queryset = queryset.filter(user=user)
        elif user.user_type == 'officer':
            try:
                officer = Officer.objects.get(user=user)
                if officer.officer_type == 'department':
                    queryset = queryset.filter(department=officer.department)
                elif officer.officer_type == 'verification':
                    queryset = queryset.filter(Q(status='New') | Q(verification_officer=officer))
            except Officer.DoesNotExist:
                queryset = Complaint.objects.none()
        
        # Apply filters
        status_filter = self.request.query_params.get('status')
        priority_filter = self.request.query_params.get('priority')
        department_filter = self.request.query_params.get('department')
        
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        if priority_filter:
            queryset = queryset.filter(priority=priority_filter)
        if department_filter:
            queryset = queryset.filter(department_id=department_filter)
        
        return queryset.order_by('-created_at')
    
    def get_serializer_class(self):
        if self.action == 'create':
            return ComplaintCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return ComplaintUpdateSerializer
        return ComplaintSerializer
    
    def create(self, request, *args, **kwargs):
        """Create a new complaint"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Set user and department
        user = request.user
        department_id = request.data.get('department_id')
        
        if department_id:
            department = Department.objects.get(id=department_id)
        else:
            # Auto-assign department based on complaint type
            department = self._auto_assign_department(request.data.get('complaint_type'))
        
        complaint = serializer.save(user=user, department=department)
        
        # Handle photo uploads
        photos = request.data.getlist('photos')
        for photo_url in photos:
            ComplaintPhoto.objects.create(complaint=complaint, photo_url=photo_url)
        
        return Response(ComplaintSerializer(complaint).data, status=status.HTTP_201_CREATED)
    
    def _auto_assign_department(self, complaint_type):
        """Auto-assign department based on complaint type"""
        department_mapping = {
            'Road Damage': 1,  # Road Development
            'Water Leak': 2,   # Water Board
            'Power Outage': 3, # Electricity Board
            'Facility Damage': 7, # Public Facilities
            'Garbage Collection': 6, # Garbage Management
            'Drainage Issue': 5, # Drainage Board
            'Transport Issue': 4, # Public Transport
        }
        return Department.objects.get(id=department_mapping.get(complaint_type, 7))
    
    @action(detail=True, methods=['post'])
    def verify(self, request, pk=None):
        """Verify a complaint (verification officers only)"""
        complaint = self.get_object()
        user = request.user
        
        try:
            officer = Officer.objects.get(user=user, officer_type='verification')
            complaint.verification_officer = officer
            complaint.status = 'Verified'
            complaint.verification_officer_comment = request.data.get('comment', '')
            complaint.save()
            
            return Response({
                'message': 'Complaint verified successfully',
                'complaint': ComplaintSerializer(complaint).data
            })
        except Officer.DoesNotExist:
            return Response(
                {'error': 'Only verification officers can verify complaints'}, 
                status=status.HTTP_403_FORBIDDEN
            )
    
    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        """Update complaint status and add department comment"""
        complaint = self.get_object()
        user = request.user
        
        try:
            officer = Officer.objects.get(user=user, officer_type='department')
            complaint.department_officer = officer
            complaint.status = request.data.get('status')
            complaint.department_officer_comment = request.data.get('comment', '')
            
            if request.data.get('estimated_completion'):
                complaint.estimated_completion = request.data.get('estimated_completion')
            
            if complaint.status == 'Resolved':
                from django.utils import timezone
                complaint.resolved_date = timezone.now()
            
            complaint.save()
            
            return Response({
                'message': 'Complaint status updated successfully',
                'complaint': ComplaintSerializer(complaint).data
            })
        except Officer.DoesNotExist:
            return Response(
                {'error': 'Only department officers can update complaint status'}, 
                status=status.HTTP_403_FORBIDDEN
            )
    
    @action(detail=True, methods=['post'])
    def add_photo(self, request, pk=None):
        """Add photos to a complaint"""
        complaint = self.get_object()
        photo_url = request.data.get('photo_url')
        photo_description = request.data.get('description', '')
        
        if not photo_url:
            return Response({'error': 'Photo URL is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        photo = ComplaintPhoto.objects.create(
            complaint=complaint,
            photo_url=photo_url,
            photo_description=photo_description
        )
        
        return Response(ComplaintPhotoSerializer(photo).data, status=status.HTTP_201_CREATED)


# API Views for Admin Dashboard
@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_dashboard_stats(request):
    """Get admin dashboard statistics"""
    total_complaints = Complaint.objects.count()
    new_complaints = Complaint.objects.filter(status='New').count()
    in_progress_complaints = Complaint.objects.filter(status='In Progress').count()
    resolved_complaints = Complaint.objects.filter(status='Resolved').count()
    total_officers = Officer.objects.filter(is_active=True).count()
    total_users = User.objects.filter(user_type='citizen').count()
    
    return Response({
        'total_complaints': total_complaints,
        'new_complaints': new_complaints,
        'in_progress_complaints': in_progress_complaints,
        'resolved_complaints': resolved_complaints,
        'total_officers': total_officers,
        'total_users': total_users,
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def recent_complaints(request):
    """Get recent complaints for dashboard"""
    limit = int(request.GET.get('limit', 10))
    complaints = Complaint.objects.all().order_by('-created_at')[:limit]
    serializer = ComplaintSerializer(complaints, many=True)
    return Response(serializer.data)
