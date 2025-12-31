from rest_framework import serializers
from .models import Department, DepartmentService


class DepartmentServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = DepartmentService
        fields = ['id', 'name', 'description', 'is_active', 'created_at']
        read_only_fields = ['created_at']


class DepartmentSerializer(serializers.ModelSerializer):
    officer_count = serializers.ReadOnlyField()
    complaint_count = serializers.ReadOnlyField()
    services = DepartmentServiceSerializer(many=True, read_only=True)
    
    class Meta:
        model = Department
        fields = ['id', 'name', 'code', 'description', 'icon', 'is_active', 
                  'created_at', 'updated_at', 'officer_count', 'complaint_count', 'services']
        read_only_fields = ['created_at', 'updated_at', 'officer_count', 'complaint_count']
    
    def create(self, validated_data):
        # Handle services if provided in the request
        services_data = validated_data.pop('services', None)
        department = Department.objects.create(**validated_data)
        
        if services_data:
            for service_data in services_data:
                DepartmentService.objects.create(department=department, **service_data)
        
        return department
    
    def update(self, instance, validated_data):
        # Handle services if provided in the request
        services_data = validated_data.pop('services', None)
        
        # Update department fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        if services_data is not None:
            # Clear existing services
            instance.services.all().delete()
            
            # Create new services
            for service_data in services_data:
                DepartmentService.objects.create(department=instance, **service_data)
        
        return instance


class DepartmentListSerializer(serializers.ModelSerializer):
    officer_count = serializers.ReadOnlyField()
    complaint_count = serializers.ReadOnlyField()
    
    class Meta:
        model = Department
        fields = ['id', 'name', 'code', 'icon', 'is_active', 'officer_count', 'complaint_count']
