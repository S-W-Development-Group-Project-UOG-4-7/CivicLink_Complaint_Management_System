from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Department, Officer, Complaint, ComplaintPhoto


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'user_type', 'is_active', 'created_at')
    list_filter = ('user_type', 'is_active', 'created_at')
    search_fields = ('username', 'email', 'first_name', 'last_name')
    ordering = ('-created_at',)
    
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'email', 'phone', 'address', 'district', 'province')}),
        ('Permissions', {'fields': ('user_type', 'is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined', 'created_at', 'updated_at')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password', 'user_type'),
        }),
    )


@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ('name', 'icon', 'created_at')
    search_fields = ('name', 'description')
    ordering = ('name',)


@admin.register(Officer)
class OfficerAdmin(admin.ModelAdmin):
    list_display = ('user', 'department', 'officer_type', 'badge_number', 'is_active', 'created_at')
    list_filter = ('officer_type', 'is_active', 'department', 'created_at')
    search_fields = ('user__username', 'user__email', 'badge_number')
    ordering = ('-created_at',)
    
    fieldsets = (
        ('Officer Information', {'fields': ('user', 'department', 'officer_type', 'badge_number')}),
        ('Status', {'fields': ('is_active',)}),
        ('Dates', {'fields': ('created_at', 'updated_at')}),
    )


class ComplaintPhotoInline(admin.TabularInline):
    model = ComplaintPhoto
    extra = 1
    readonly_fields = ('uploaded_at',)


@admin.register(Complaint)
class ComplaintAdmin(admin.ModelAdmin):
    list_display = ('complaint_id', 'title', 'user', 'department', 'status', 'priority', 'submitted_date')
    list_filter = ('status', 'priority', 'department', 'complaint_type', 'submitted_date')
    search_fields = ('complaint_id', 'title', 'user__username', 'address', 'place')
    ordering = ('-submitted_date',)
    readonly_fields = ('complaint_id', 'submitted_date', 'created_at', 'updated_at')
    inlines = [ComplaintPhotoInline]
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('complaint_id', 'user', 'department', 'title', 'description', 'complaint_type')
        }),
        ('Status & Priority', {
            'fields': ('status', 'priority', 'estimated_completion', 'resolved_date')
        }),
        ('Location', {
            'fields': ('address', 'district', 'province', 'place', 'latitude', 'longitude')
        }),
        ('Officers', {
            'fields': ('verification_officer', 'department_officer')
        }),
        ('Comments', {
            'fields': ('verification_officer_comment', 'department_officer_comment')
        }),
        ('System Information', {
            'fields': ('submitted_date', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def get_readonly_fields(self, request, obj=None):
        if obj:  # Editing an existing object
            return self.readonly_fields + ('complaint_id',)
        return self.readonly_fields


@admin.register(ComplaintPhoto)
class ComplaintPhotoAdmin(admin.ModelAdmin):
    list_display = ('complaint', 'photo_description', 'uploaded_at')
    list_filter = ('uploaded_at',)
    search_fields = ('complaint__complaint_id', 'complaint__title', 'photo_description')
    ordering = ('-uploaded_at',)
