from django.contrib import admin
from .models import Complaint, ComplaintComment, ComplaintAttachment


class ComplaintCommentInline(admin.TabularInline):
    model = ComplaintComment
    extra = 1
    readonly_fields = ['created_at', 'author']
    fields = ['content', 'is_internal', 'author', 'created_at']


class ComplaintAttachmentInline(admin.TabularInline):
    model = ComplaintAttachment
    extra = 1
    readonly_fields = ['uploaded_at', 'uploaded_by']
    fields = ['file', 'filename', 'uploaded_by', 'uploaded_at']


@admin.register(Complaint)
class ComplaintAdmin(admin.ModelAdmin):
    list_display = ['id', 'title', 'citizen_name', 'department', 'status', 'priority', 'created_at']
    list_filter = ['status', 'priority', 'created_at', 'department']
    search_fields = ['title', 'description', 'citizen_name', 'citizen_email']
    ordering = ['-created_at']
    readonly_fields = ['created_at', 'updated_at', 'resolved_at']
    
    fieldsets = (
        ('Complaint Details', {
            'fields': ('title', 'description', 'department', 'assigned_officer')
        }),
        ('Citizen Information', {
            'fields': ('citizen_name', 'citizen_email', 'citizen_phone', 'citizen_address')
        }),
        ('Location', {
            'fields': ('location', 'province')
        }),
        ('Status & Priority', {
            'fields': ('status', 'priority', 'admin_notes')
        }),
        ('Attachments', {
            'fields': ('attachment',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at', 'resolved_at'),
            'classes': ('collapse',)
        }),
    )
    
    inlines = [ComplaintCommentInline, ComplaintAttachmentInline]


@admin.register(ComplaintComment)
class ComplaintCommentAdmin(admin.ModelAdmin):
    list_display = ['complaint', 'author', 'created_at', 'is_internal']
    list_filter = ['is_internal', 'created_at']
    search_fields = ['content', 'complaint__title', 'author__username']
    ordering = ['-created_at']
    readonly_fields = ['created_at']


@admin.register(ComplaintAttachment)
class ComplaintAttachmentAdmin(admin.ModelAdmin):
    list_display = ['filename', 'complaint', 'uploaded_by', 'uploaded_at']
    list_filter = ['uploaded_at']
    search_fields = ['filename', 'complaint__title', 'uploaded_by__username']
    ordering = ['-uploaded_at']
    readonly_fields = ['uploaded_at', 'uploaded_by']
