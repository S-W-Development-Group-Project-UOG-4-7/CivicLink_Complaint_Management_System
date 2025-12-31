from rest_framework import serializers
from .models import User, Department, Officer, Complaint, ComplaintPhoto


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'first_name', 'last_name', 
                 'phone', 'address', 'district', 'province', 'user_type', 'is_active']
        extra_kwargs = {
            'password': {'write_only': True}
        }
    
    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        return user


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = "__all__"


class OfficerSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    department_name = serializers.CharField(source='department.name', read_only=True)
    
    class Meta:
        model = Officer
        fields = ['id', 'user', 'department', 'department_name', 'officer_type', 
                 'badge_number', 'is_active', 'created_at']


class ComplaintPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ComplaintPhoto
        fields = ['id', 'photo_url', 'photo_description', 'uploaded_at']


class ComplaintSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    department_name = serializers.CharField(source='department.name', read_only=True)
    department_icon = serializers.CharField(source='department.icon', read_only=True)
    verification_officer_name = serializers.CharField(source='verification_officer.user.get_full_name', read_only=True)
    department_officer_name = serializers.CharField(source='department_officer.user.get_full_name', read_only=True)
    photos = ComplaintPhotoSerializer(many=True, read_only=True)
    
    class Meta:
        model = Complaint
        fields = ['id', 'complaint_id', 'user', 'user_name', 'department', 'department_name', 
                 'department_icon', 'verification_officer', 'verification_officer_name',
                 'department_officer', 'department_officer_name', 'title', 'description', 
                 'complaint_type', 'status', 'priority', 'address', 'district', 'province', 
                 'place', 'latitude', 'longitude', 'verification_officer_comment', 
                 'department_officer_comment', 'submitted_date', 'estimated_completion', 
                 'resolved_date', 'created_at', 'updated_at', 'photos']


class ComplaintCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Complaint
        fields = ['title', 'description', 'complaint_type', 'priority', 'address', 
                 'district', 'province', 'place', 'latitude', 'longitude']
    
    def create(self, validated_data):
        # Generate complaint ID
        import datetime
        last_complaint = Complaint.objects.all().order_by('-id').first()
        if last_complaint:
            last_id = int(last_complaint.complaint_id[3:])
            new_id = f"CMP{last_id + 1:03d}"
        else:
            new_id = "CMP001"
        
        validated_data['complaint_id'] = new_id
        return super().create(validated_data)


class ComplaintUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Complaint
        fields = ['status', 'verification_officer_comment', 'department_officer_comment', 
                 'estimated_completion']


class DepartmentStatsSerializer(serializers.Serializer):
    department_name = serializers.CharField()
    icon = serializers.CharField()
    total_complaints = serializers.IntegerField()
    new_complaints = serializers.IntegerField()
    in_progress_complaints = serializers.IntegerField()
    resolved_complaints = serializers.IntegerField()
    high_priority_complaints = serializers.IntegerField()
