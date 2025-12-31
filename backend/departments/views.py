from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Count

from .models import Department, DepartmentService
from .serializers import DepartmentSerializer, DepartmentListSerializer, DepartmentServiceSerializer


class DepartmentListView(generics.ListCreateAPIView):
    queryset = Department.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method == 'GET':
            return DepartmentListSerializer
        return DepartmentSerializer
    
    def get_queryset(self):
        queryset = Department.objects.annotate(
            officer_count=Count('officer', filter=models.Q(officer__is_active=True)),
            complaint_count=Count('complaint')
        )
        
        # Filter by active status if provided
        is_active = self.request.query_params.get('is_active')
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')
        
        return queryset


class DepartmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [permissions.IsAuthenticated]


class DepartmentServiceListView(generics.ListCreateAPIView):
    serializer_class = DepartmentServiceSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        department_id = self.kwargs['department_id']
        return DepartmentService.objects.filter(department_id=department_id)
    
    def perform_create(self, serializer):
        department_id = self.kwargs['department_id']
        department = Department.objects.get(id=department_id)
        serializer.save(department=department)


class DepartmentServiceDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = DepartmentServiceSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return DepartmentService.objects.all()


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def department_statistics(request):
    """Get department statistics for admin dashboard"""
    departments = Department.objects.annotate(
        officer_count=Count('officer', filter=models.Q(officer__is_active=True)),
        complaint_count=Count('complaint')
    )
    
    stats = []
    for dept in departments:
        stats.append({
            'id': dept.id,
            'name': dept.name,
            'code': dept.code,
            'officer_count': dept.officer_count,
            'complaint_count': dept.complaint_count,
            'is_active': dept.is_active
        })
    
    return Response({
        'departments': stats,
        'total_departments': departments.count(),
        'active_departments': departments.filter(is_active=True).count()
    })
