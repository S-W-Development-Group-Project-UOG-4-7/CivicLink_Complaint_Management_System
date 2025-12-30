from rest_framework import serializers
from django.contrib.auth.models import User
from .models import CitizenProfile, Complaint, Priority
from .services.routing import decide_department
from django.utils.crypto import get_random_string

class CitizenCreateSerializer(serializers.ModelSerializer):
    username = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = CitizenProfile
        fields = ['username', 'password', 'nic', 'full_name', 'address', 'gn_division']

    def create(self, validated_data):
        username = validated_data.pop('username')
        password = validated_data.pop('password')
        request = self.context.get('request')
        user = User.objects.create_user(username=username, password=password)
        citizen = CitizenProfile.objects.create(user=user, created_by=getattr(request, 'user', None), **validated_data)
        return citizen

class CitizenSerializer(serializers.ModelSerializer):
    class Meta:
        model = CitizenProfile
        fields = ['id', 'nic', 'full_name', 'address', 'gn_division']

class ComplaintCreateSerializer(serializers.ModelSerializer):
    nic = serializers.CharField(write_only=True, required=True)
    assigned_department = serializers.CharField(read_only=True)
    reference_code = serializers.CharField(read_only=True)

    class Meta:
        model = Complaint
        fields = [
            'nic', 'title', 'description', 'category', 'keywords',
            'is_emergency', 'priority',
            'address', 'city', 'district', 'latitude', 'longitude',
            'incident_date', 'photo',
            'assigned_department', 'reference_code',
        ]
        extra_kwargs = {
            'priority': {'required': False},
        }

    def validate(self, data):
        if data.get('is_emergency'):
            data['priority'] = Priority.EMERGENCY
        else:
            data['priority'] = data.get('priority') or Priority.NORMAL
        return data

    def create(self, validated_data):
        nic = validated_data.pop('nic')
        try:
            citizen = CitizenProfile.objects.get(nic=nic)
        except CitizenProfile.DoesNotExist:
            raise serializers.ValidationError({'nic': 'Citizen not found. Please contact your GN/Officer.'})
        assigned = decide_department(
            validated_data.get('category', ''),
            validated_data.get('title', ''),
            validated_data.get('description', '')
        )
        validated_data['assigned_department'] = assigned
        ref = f"CL-{get_random_string(8).upper()}"
        validated_data['reference_code'] = ref
        complaint = Complaint.objects.create(citizen=citizen, **validated_data)
        return complaint

class ComplaintSerializer(serializers.ModelSerializer):
    citizen = CitizenSerializer(read_only=True)

    class Meta:
        model = Complaint
        fields = '__all__'
