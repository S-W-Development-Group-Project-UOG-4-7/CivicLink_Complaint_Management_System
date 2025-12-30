from rest_framework import viewsets, mixins, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import CitizenProfile, Complaint, Status
from .serializers import (
    CitizenCreateSerializer, CitizenSerializer,
    ComplaintCreateSerializer, ComplaintSerializer
)
from .permissions import IsOfficer, IsAuthenticatedOrCitizenNIC

class CitizenViewSet(mixins.CreateModelMixin,
                     mixins.ListModelMixin,
                     mixins.RetrieveModelMixin,
                     viewsets.GenericViewSet):
    queryset = CitizenProfile.objects.select_related('user').all()

    def get_permissions(self):
        return [IsAuthenticated(), IsOfficer()]

    def get_serializer_class(self):
        if self.action == 'create':
            return CitizenCreateSerializer
        return CitizenSerializer

class ComplaintViewSet(mixins.CreateModelMixin,
                       mixins.RetrieveModelMixin,
                       mixins.ListModelMixin,
                       mixins.UpdateModelMixin,
                       viewsets.GenericViewSet):
    queryset = Complaint.objects.select_related('citizen').all()

    def get_permissions(self):
        if self.action == 'create':
            return [IsAuthenticatedOrCitizenNIC()]
        return [IsAuthenticated(), IsOfficer()]

    def get_serializer_class(self):
        if self.action == 'create':
            return ComplaintCreateSerializer
        return ComplaintSerializer

    @action(detail=False, methods=['get'], url_path='emergencies')
    def emergencies(self, request):
        qs = self.get_queryset().filter(is_emergency=True).order_by('-created_at')
        ser = ComplaintSerializer(qs, many=True)
        return Response(ser.data)

    @action(detail=False, methods=['get'], url_path='by-status')
    def by_status(self, request):
        status_param = request.query_params.get('status', Status.PENDING)
        qs = self.get_queryset().filter(status=status_param).order_by('-created_at')
        ser = ComplaintSerializer(qs, many=True)
        return Response(ser.data)

    @action(detail=True, methods=['post'], url_path='set-status')
    def set_status(self, request, pk=None):
        complaint = self.get_object()
        new_status = request.data.get('status')
        if new_status not in dict(Status.choices):
            return Response({'detail': 'Invalid status.'}, status=status.HTTP_400_BAD_REQUEST)
        complaint.status = new_status
        complaint.save(update_fields=['status', 'updated_at'])
        return Response(ComplaintSerializer(complaint).data)
