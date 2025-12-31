from django.db import models
from django.utils import timezone


class Department(models.Model):
    name = models.CharField(max_length=100, unique=True)
    code = models.CharField(max_length=20, unique=True)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, blank=True)  # For frontend icons
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'departments'
        verbose_name = 'Department'
        verbose_name_plural = 'Departments'
        ordering = ['name']
    
    def __str__(self):
        return self.name
    
    @property
    def officer_count(self):
        from accounts.models import Officer
        return Officer.objects.filter(department=self, is_active=True).count()
    
    @property
    def complaint_count(self):
        from complaints.models import Complaint
        return Complaint.objects.filter(department=self).count()


class DepartmentService(models.Model):
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='services')
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'department_services'
        verbose_name = 'Department Service'
        verbose_name_plural = 'Department Services'
        unique_together = ['department', 'name']
        ordering = ['name']
    
    def __str__(self):
        return f"{self.department.name} - {self.name}"
