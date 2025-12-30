from django.conf import settings
from django.db import models

class Department(models.TextChoices):
    MUNICIPAL = 'MUNICIPAL', 'Municipal Council'
    POLICE = 'POLICE', 'Police'
    ELECTRICITY = 'ELECTRICITY', 'Electricity Board'
    WATER = 'WATER', 'Water Board'
    HEALTH = 'HEALTH', 'Health Department'

class Priority(models.TextChoices):
    EMERGENCY = 'EMERGENCY', 'Emergency'
    HIGH = 'HIGH', 'High'
    NORMAL = 'NORMAL', 'Normal'

class Status(models.TextChoices):
    PENDING = 'PENDING', 'Pending'
    IN_PROGRESS = 'IN_PROGRESS', 'In Progress'
    RESOLVED = 'RESOLVED', 'Resolved'

class OfficerProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='officer_profile')
    gn_division = models.CharField(max_length=128, blank=True, default='')
    def __str__(self):
        return f"Officer({self.user.username})"

class CitizenProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='citizen_profile')
    nic = models.CharField(max_length=20, unique=True)
    full_name = models.CharField(max_length=150)
    address = models.TextField()
    gn_division = models.CharField(max_length=128)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL, related_name='created_citizens')
    def __str__(self):
        return f"{self.full_name} ({self.nic})"

def attachments_upload_path(instance, filename):
    return f"complaints/{instance.id or 'new'}/{filename}"

class Complaint(models.Model):
    citizen = models.ForeignKey(CitizenProfile, on_delete=models.CASCADE, related_name='complaints')
    title = models.CharField(max_length=120)
    description = models.TextField()
    category = models.CharField(max_length=64)
    keywords = models.TextField(blank=True, default='')

    assigned_department = models.CharField(max_length=32, choices=Department.choices)

    is_emergency = models.BooleanField(default=False)
    priority = models.CharField(max_length=16, choices=Priority.choices, default=Priority.NORMAL)

    address = models.TextField(blank=True, default='')
    city = models.CharField(max_length=64, blank=True, default='')
    district = models.CharField(max_length=64, blank=True, default='')
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)

    status = models.CharField(max_length=16, choices=Status.choices, default=Status.PENDING)

    incident_date = models.DateField(null=True, blank=True)

    photo = models.ImageField(upload_to=attachments_upload_path, null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    reference_code = models.CharField(max_length=20, unique=True)

    def __str__(self):
        return f"{self.reference_code} - {self.title}"
