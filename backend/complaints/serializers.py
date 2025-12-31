from rest_framework import serializers
from .models import Complaint, ComplaintComment, ComplaintAttachment


class ComplaintAttachmentSerializer(serializers.ModelSerializer):
    uploaded_by_username = serializers.CharField(source='uploaded_by.username', read_only=True)
    
    class Meta:
        model = ComplaintAttachment
        fields = ['id', 'file', 'filename', 'uploaded_at', 'uploaded_by', 'uploaded_by_username']
        read_only_fields = ['uploaded_by', 'uploaded_at']


class ComplaintCommentSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(source='author.username', read_only=True)
    author_role = serializers.CharField(source='author.role', read_only=True)
    
    class Meta:
        model = ComplaintComment
        fields = ['id', 'content', 'author', 'author_username', 'author_role', 
                  'created_at', 'is_internal']
        read_only_fields = ['author', 'created_at']


class ComplaintSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source='department.name', read_only=True)
    assigned_officer_name = serializers.SerializerMethodField()
    comments = ComplaintCommentSerializer(many=True, read_only=True)
    attachments = ComplaintAttachmentSerializer(many=True, read_only=True)
    days_open = serializers.SerializerMethodField()
    
    class Meta:
        model = Complaint
        fields = ['id', 'title', 'description', 'citizen_name', 'citizen_email', 'citizen_phone',
                  'citizen_address', 'department', 'department_name', 'assigned_officer', 
                  'assigned_officer_name', 'status', 'priority', 'location', 'province', 
                  'created_at', 'updated_at', 'resolved_at', 'attachment', 'admin_notes',
                  'comments', 'attachments', 'days_open']
        read_only_fields = ['created_at', 'updated_at', 'resolved_at', 'days_open']
    
    def get_assigned_officer_name(self, obj):
        if obj.assigned_officer:
            return f"{obj.assigned_officer.user.first_name} {obj.assigned_officer.user.last_name}".strip() or obj.assigned_officer.user.username
        return None
    
    def get_days_open(self, obj):
        from django.utils import timezone
        if obj.resolved_at:
            return (obj.resolved_at - obj.created_at).days
        return (timezone.now() - obj.created_at).days


class ComplaintCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Complaint
        fields = ['title', 'description', 'citizen_name', 'citizen_email', 'citizen_phone',
                  'citizen_address', 'department', 'priority', 'location', 'province', 'attachment']
    
    def create(self, validated_data):
        complaint = Complaint.objects.create(**validated_data)
        return complaint


class ComplaintUpdateSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source='department.name', read_only=True)
    assigned_officer_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Complaint
        fields = ['id', 'title', 'description', 'citizen_name', 'citizen_email', 'citizen_phone',
                  'citizen_address', 'department', 'department_name', 'assigned_officer', 
                  'assigned_officer_name', 'status', 'priority', 'location', 'province', 
                  'created_at', 'updated_at', 'resolved_at', 'attachment', 'admin_notes']
        read_only_fields = ['created_at', 'updated_at', 'resolved_at', 'citizen_name', 
                          'citizen_email', 'citizen_phone', 'citizen_address']
    
    def get_assigned_officer_name(self, obj):
        if obj.assigned_officer:
            return f"{obj.assigned_officer.user.first_name} {obj.assigned_officer.user.last_name}".strip() or obj.assigned_officer.user.username
        return None


class ComplaintListSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source='department.name', read_only=True)
    assigned_officer_name = serializers.SerializerMethodField()
    days_open = serializers.SerializerMethodField()
    
    class Meta:
        model = Complaint
        fields = ['id', 'title', 'citizen_name', 'department_name', 'assigned_officer_name',
                  'status', 'priority', 'created_at', 'days_open']
    
    def get_assigned_officer_name(self, obj):
        if obj.assigned_officer:
            return f"{obj.assigned_officer.user.first_name} {obj.assigned_officer.user.last_name}".strip() or obj.assigned_officer.user.username
        return None
    
    def get_days_open(self, obj):
        from django.utils import timezone
        if obj.resolved_at:
            return (obj.resolved_at - obj.created_at).days
        return (timezone.now() - obj.created_at).days
