from rest_framework import generics, permissions, status, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Count, Q
from django.utils import timezone
from datetime import timedelta

from .models import Complaint, ComplaintComment, ComplaintAttachment
from .serializers import (
    ComplaintSerializer, ComplaintCreateSerializer, ComplaintUpdateSerializer,
    ComplaintListSerializer, ComplaintCommentSerializer, ComplaintAttachmentSerializer
)


class ComplaintListView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'citizen_name', 'location']
    ordering_fields = ['created_at', 'updated_at', 'priority', 'status']
    ordering = ['-created_at']
    
    def get_queryset(self):
        queryset = Complaint.objects.select_related('department', 'assigned_officer__user')
        
        # Filter by status
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        # Filter by department
        department_id = self.request.query_params.get('department')
        if department_id:
            queryset = queryset.filter(department_id=department_id)
        
        # Filter by priority
        priority = self.request.query_params.get('priority')
        if priority:
            queryset = queryset.filter(priority=priority)
        
        # Filter by date range
        date_from = self.request.query_params.get('date_from')
        date_to = self.request.query_params.get('date_to')
        if date_from:
            queryset = queryset.filter(created_at__gte=date_from)
        if date_to:
            queryset = queryset.filter(created_at__lte=date_to)
        
        return queryset
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ComplaintCreateSerializer
        return ComplaintListSerializer


class ComplaintDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Complaint.objects.select_related('department', 'assigned_officer__user')
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return ComplaintUpdateSerializer
        return ComplaintSerializer


class ComplaintCommentListView(generics.ListCreateAPIView):
    serializer_class = ComplaintCommentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        complaint_id = self.kwargs['complaint_id']
        return ComplaintComment.objects.filter(complaint_id=complaint_id).select_related('author')
    
    def perform_create(self, serializer):
        complaint_id = self.kwargs['complaint_id']
        complaint = Complaint.objects.get(id=complaint_id)
        serializer.save(complaint=complaint, author=self.request.user)


class ComplaintCommentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ComplaintComment.objects.all()
    serializer_class = ComplaintCommentSerializer
    permission_classes = [permissions.IsAuthenticated]


class ComplaintAttachmentListView(generics.ListCreateAPIView):
    serializer_class = ComplaintAttachmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        complaint_id = self.kwargs['complaint_id']
        return ComplaintAttachment.objects.filter(complaint_id=complaint_id).select_related('uploaded_by')
    
    def perform_create(self, serializer):
        complaint_id = self.kwargs['complaint_id']
        complaint = Complaint.objects.get(id=complaint_id)
        serializer.save(complaint=complaint, uploaded_by=self.request.user)


class ComplaintAttachmentDetailView(generics.RetrieveDestroyAPIView):
    queryset = ComplaintAttachment.objects.all()
    serializer_class = ComplaintAttachmentSerializer
    permission_classes = [permissions.IsAuthenticated]


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def complaint_statistics(request):
    """Get complaint statistics for admin dashboard"""
    
    # Basic counts
    total_complaints = Complaint.objects.count()
    pending_complaints = Complaint.objects.filter(status='pending').count()
    in_progress_complaints = Complaint.objects.filter(status='in_progress').count()
    resolved_complaints = Complaint.objects.filter(status='resolved').count()
    
    # Priority breakdown
    priority_stats = Complaint.objects.values('priority').annotate(count=Count('id'))
    
    # Department breakdown
    department_stats = Complaint.objects.values('department__name').annotate(
        count=Count('id'),
        pending=Count('id', filter=Q(status='pending')),
        resolved=Count('id', filter=Q(status='resolved'))
    ).order_by('-count')
    
    # Recent complaints (last 7 days)
    seven_days_ago = timezone.now() - timedelta(days=7)
    recent_complaints = Complaint.objects.filter(created_at__gte=seven_days_ago).count()
    
    # Average resolution time
    resolved_complaints_with_time = Complaint.objects.filter(
        status='resolved',
        resolved_at__isnull=False
    )
    avg_resolution_time = 0
    if resolved_complaints_with_time.exists():
        total_resolution_time = sum(
            (c.resolved_at - c.created_at).total_seconds() 
            for c in resolved_complaints_with_time
        )
        avg_resolution_time = total_resolution_time / resolved_complaints_with_time.count() / 86400  # Convert to days
    
    return Response({
        'overview': {
            'total_complaints': total_complaints,
            'pending_complaints': pending_complaints,
            'in_progress_complaints': in_progress_complaints,
            'resolved_complaints': resolved_complaints,
            'recent_complaints': recent_complaints,
            'avg_resolution_time': round(avg_resolution_time, 1)
        },
        'by_priority': list(priority_stats),
        'by_department': list(department_stats)
    })


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def assign_officer(request, complaint_id):
    """Assign an officer to a complaint"""
    try:
        complaint = Complaint.objects.get(id=complaint_id)
        officer_id = request.data.get('officer_id')
        
        if officer_id:
            from accounts.models import Officer
            officer = Officer.objects.get(id=officer_id)
            complaint.assigned_officer = officer
            complaint.status = 'in_progress'
            complaint.save()
            
            return Response({
                'message': 'Officer assigned successfully',
                'officer': f"{officer.user.first_name} {officer.user.last_name}".strip() or officer.user.username
            })
        else:
            complaint.assigned_officer = None
            complaint.status = 'pending'
            complaint.save()
            
            return Response({
                'message': 'Officer unassigned successfully'
            })
            
    except Complaint.DoesNotExist:
        return Response({'error': 'Complaint not found'}, status=status.HTTP_404_NOT_FOUND)
    except Officer.DoesNotExist:
        return Response({'error': 'Officer not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def update_complaint_status(request, complaint_id):
    """Update complaint status"""
    try:
        complaint = Complaint.objects.get(id=complaint_id)
        new_status = request.data.get('status')
        admin_notes = request.data.get('admin_notes', '')
        
        if new_status in [choice[0] for choice in Complaint.STATUS_CHOICES]:
            complaint.status = new_status
            if admin_notes:
                complaint.admin_notes = admin_notes
            complaint.save()
            
            return Response({
                'message': 'Status updated successfully',
                'status': complaint.status
            })
        else:
            return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)
            
    except Complaint.DoesNotExist:
        return Response({'error': 'Complaint not found'}, status=status.HTTP_404_NOT_FOUND)
