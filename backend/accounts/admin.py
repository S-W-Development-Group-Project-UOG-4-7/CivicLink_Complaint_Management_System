from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import AdminUser, Officer, AdminSession


@admin.register(AdminUser)
class AdminUserAdmin(BaseUserAdmin):
    list_display = ['username', 'email', 'first_name', 'last_name', 'role', 'is_active', 'created_at']
    list_filter = ['role', 'is_active', 'created_at']
    search_fields = ['username', 'email', 'first_name', 'last_name']
    ordering = ['-created_at']
    
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'email')}),
        ('Permissions', {'fields': ('role', 'is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined', 'created_at', 'updated_at')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'first_name', 'last_name', 'role', 'password1', 'password2'),
        }),
    )
    
    readonly_fields = ['created_at', 'updated_at', 'last_login', 'date_joined']


@admin.register(Officer)
class OfficerAdmin(admin.ModelAdmin):
    list_display = ['user', 'employee_id', 'department', 'phone_number', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at', 'department']
    search_fields = ['user__username', 'user__first_name', 'user__last_name', 'employee_id']
    ordering = ['-created_at']
    
    fieldsets = (
        (None, {'fields': ('user', 'department', 'employee_id')}),
        ('Contact Info', {'fields': ('phone_number', 'address')}),
        ('Status', {'fields': ('is_active',)}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )
    
    readonly_fields = ['created_at', 'updated_at']


@admin.register(AdminSession)
class AdminSessionAdmin(admin.ModelAdmin):
    list_display = ['user', 'session_token', 'created_at', 'expires_at', 'is_active']
    list_filter = ['is_active', 'created_at', 'expires_at']
    search_fields = ['user__username', 'session_token']
    ordering = ['-created_at']
    
    readonly_fields = ['user', 'session_token', 'created_at', 'expires_at']
