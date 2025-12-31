from django.contrib import admin
from .models import Department, DepartmentService


@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ['name', 'code', 'icon', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'code', 'description']
    ordering = ['name']
    
    fieldsets = (
        (None, {'fields': ('name', 'code', 'icon')}),
        ('Details', {'fields': ('description',)}),
        ('Status', {'fields': ('is_active',)}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )
    
    readonly_fields = ['created_at', 'updated_at']


@admin.register(DepartmentService)
class DepartmentServiceAdmin(admin.ModelAdmin):
    list_display = ['name', 'department', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at', 'department']
    search_fields = ['name', 'description', 'department__name']
    ordering = ['department__name', 'name']
    
    fieldsets = (
        (None, {'fields': ('department', 'name')}),
        ('Details', {'fields': ('description',)}),
        ('Status', {'fields': ('is_active',)}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )
    
    readonly_fields = ['created_at', 'updated_at']
