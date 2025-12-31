from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import AdminUser, Officer


class AdminLoginSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(max_length=128, write_only=True)
    role = serializers.ChoiceField(choices=[('admin', 'Admin'), ('officer', 'Officer')])
    
    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')
        role = attrs.get('role')
        
        if username and password:
            user = authenticate(username=username, password=password)
            
            if not user:
                raise serializers.ValidationError('Invalid credentials')
            
            if not user.is_active:
                raise serializers.ValidationError('User account is disabled')
            
            # Check if user has the correct role
            if hasattr(user, 'role') and user.role != role:
                raise serializers.ValidationError(f'User is not registered as {role}')
            
            attrs['user'] = user
            return attrs
        else:
            raise serializers.ValidationError('Must include username and password')


class AdminUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = AdminUser
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'password', 'is_active']
        extra_kwargs = {
            'password': {'write_only': True}
        }
    
    def create(self, validated_data):
        password = validated_data.pop('password')
        user = AdminUser(**validated_data)
        user.set_password(password)
        user.save()
        return user


class OfficerSerializer(serializers.ModelSerializer):
    user = AdminUserSerializer(read_only=True)
    user_id = serializers.IntegerField(write_only=True)
    department_name = serializers.CharField(source='department.name', read_only=True)
    
    class Meta:
        model = Officer
        fields = ['id', 'user', 'user_id', 'department', 'department_name', 'employee_id', 
                  'phone_number', 'address', 'is_active', 'created_at']
        read_only_fields = ['created_at']
    
    def create(self, validated_data):
        user_id = validated_data.pop('user_id')
        try:
            user = AdminUser.objects.get(id=user_id, role='officer')
        except AdminUser.DoesNotExist:
            raise serializers.ValidationError('Invalid officer user ID')
        
        officer = Officer.objects.create(user=user, **validated_data)
        return officer


class OfficerRegistrationSerializer(serializers.ModelSerializer):
    user = AdminUserSerializer()
    department_name = serializers.CharField(source='department.name', read_only=True)
    
    class Meta:
        model = Officer
        fields = ['user', 'department', 'department_name', 'employee_id', 
                  'phone_number', 'address', 'is_active']
    
    def create(self, validated_data):
        user_data = validated_data.pop('user')
        password = user_data.pop('password')
        
        # Create admin user with officer role
        user = AdminUser.objects.create_user(
            password=password,
            role='officer',
            **user_data
        )
        
        # Create officer profile
        officer = Officer.objects.create(user=user, **validated_data)
        return officer
