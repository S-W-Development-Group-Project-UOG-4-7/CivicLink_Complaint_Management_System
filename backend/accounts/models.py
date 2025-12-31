from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone


class AdminUser(AbstractUser):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('officer', 'Officer'),
    ]
    
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='officer')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'admin_users'
        verbose_name = 'Admin User'
        verbose_name_plural = 'Admin Users'
    
    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"


class Officer(models.Model):
    user = models.OneToOneField(AdminUser, on_delete=models.CASCADE, related_name='officer_profile')
    department = models.ForeignKey('departments.Department', on_delete=models.SET_NULL, null=True, blank=True)
    employee_id = models.CharField(max_length=20, unique=True)
    phone_number = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'officers'
        verbose_name = 'Officer'
        verbose_name_plural = 'Officers'
    
    def __str__(self):
        return f"{self.user.get_full_name() or self.user.username} - {self.department.name if self.department else 'No Department'}"


class AdminSession(models.Model):
    user = models.ForeignKey(AdminUser, on_delete=models.CASCADE)
    session_token = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_active = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'admin_sessions'
        verbose_name = 'Admin Session'
        verbose_name_plural = 'Admin Sessions'
    
    def __str__(self):
        return f"Session for {self.user.username}"
    
    def is_expired(self):
        return timezone.now() > self.expires_at
