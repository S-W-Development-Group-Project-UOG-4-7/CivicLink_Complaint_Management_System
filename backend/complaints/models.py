from django.db import models
from django.utils import timezone
from django.conf import settings


class Complaint(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('resolved', 'Resolved'),
        ('rejected', 'Rejected'),
        ('closed', 'Closed'),
    ]
    
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    citizen_name = models.CharField(max_length=100)
    citizen_email = models.EmailField()
    citizen_phone = models.CharField(max_length=20, blank=True)
    citizen_address = models.TextField(blank=True)
    
    department = models.ForeignKey('departments.Department', on_delete=models.SET_NULL, null=True, blank=True)
    assigned_officer = models.ForeignKey('accounts.Officer', on_delete=models.SET_NULL, null=True, blank=True)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    
    location = models.CharField(max_length=200, blank=True)
    province = models.CharField(max_length=100, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    resolved_at = models.DateTimeField(null=True, blank=True)
    
    # File attachments
    attachment = models.FileField(upload_to='complaint_attachments/', null=True, blank=True)
    
    # Admin notes
    admin_notes = models.TextField(blank=True)
    
    class Meta:
        db_table = 'complaints'
        verbose_name = 'Complaint'
        verbose_name_plural = 'Complaints'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"#{self.id} - {self.title}"
    
    def save(self, *args, **kwargs):
        # Set resolved_at when status is changed to resolved
        if self.status == 'resolved' and not self.resolved_at:
            self.resolved_at = timezone.now()
        elif self.status != 'resolved':
            self.resolved_at = None
        
        super().save(*args, **kwargs)


class ComplaintComment(models.Model):
    complaint = models.ForeignKey(Complaint, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_internal = models.BooleanField(default=False)  # Internal notes vs public comments
    
    class Meta:
        db_table = 'complaint_comments'
        verbose_name = 'Complaint Comment'
        verbose_name_plural = 'Complaint Comments'
        ordering = ['created_at']
    
    def __str__(self):
        return f"Comment by {self.author.username} on {self.complaint.title}"


class ComplaintAttachment(models.Model):
    complaint = models.ForeignKey(Complaint, on_delete=models.CASCADE, related_name='attachments')
    file = models.FileField(upload_to='complaint_attachments/')
    filename = models.CharField(max_length=255)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    uploaded_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    
    class Meta:
        db_table = 'complaint_attachments'
        verbose_name = 'Complaint Attachment'
        verbose_name_plural = 'Complaint Attachments'
        ordering = ['-uploaded_at']
    
    def __str__(self):
        return f"{self.filename} - {self.complaint.title}"
