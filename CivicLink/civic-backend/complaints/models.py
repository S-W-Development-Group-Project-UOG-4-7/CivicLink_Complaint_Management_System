from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    phone = models.CharField(max_length=20, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    district = models.CharField(max_length=50, blank=True, null=True)
    province = models.CharField(max_length=50, blank=True, null=True)
    user_type = models.CharField(
        max_length=20, 
        choices=[
            ('citizen', 'Citizen'),
            ('admin', 'Admin'),
            ('officer', 'Officer')
        ],
        default='citizen'
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.username} - {self.user_type}"


class Department(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    icon = models.CharField(max_length=50, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "departments"

    def __str__(self):
        return self.name


class Officer(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, blank=True, null=True)
    officer_type = models.CharField(
        max_length=20,
        choices=[
            ('department', 'Department Officer'),
            ('verification', 'Verification Officer')
        ]
    )
    badge_number = models.CharField(max_length=50, unique=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} - {self.badge_number}"


class Complaint(models.Model):
    complaint_id = models.CharField(max_length=20, unique=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    department = models.ForeignKey(Department, on_delete=models.RESTRICT)
    verification_officer = models.ForeignKey(Officer, on_delete=models.SET_NULL, blank=True, null=True, related_name='verified_complaints')
    department_officer = models.ForeignKey(Officer, on_delete=models.SET_NULL, blank=True, null=True, related_name='assigned_complaints')
    title = models.CharField(max_length=200)
    description = models.TextField()
    complaint_type = models.CharField(max_length=50)
    status = models.CharField(
        max_length=20,
        choices=[
            ('New', 'New'),
            ('Verified', 'Verified'),
            ('In Progress', 'In Progress'),
            ('Resolved', 'Resolved'),
            ('Cancelled', 'Cancelled')
        ],
        default='New'
    )
    priority = models.CharField(
        max_length=10,
        choices=[
            ('Low', 'Low'),
            ('Medium', 'Medium'),
            ('High', 'High')
        ],
        default='Medium'
    )
    address = models.TextField()
    district = models.CharField(max_length=50)
    province = models.CharField(max_length=50)
    place = models.CharField(max_length=100)
    latitude = models.DecimalField(max_digits=10, decimal_places=8, blank=True, null=True)
    longitude = models.DecimalField(max_digits=11, decimal_places=8, blank=True, null=True)
    verification_officer_comment = models.TextField(blank=True, null=True)
    department_officer_comment = models.TextField(blank=True, null=True)
    submitted_date = models.DateTimeField(auto_now_add=True)
    estimated_completion = models.DateField(blank=True, null=True)
    resolved_date = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "complaints"

    def __str__(self):
        return f"{self.complaint_id} - {self.title}"


class ComplaintPhoto(models.Model):
    complaint = models.ForeignKey(Complaint, on_delete=models.CASCADE, related_name='photos')
    photo_url = models.CharField(max_length=500)
    photo_description = models.CharField(max_length=200, blank=True, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "complaint_photos"

    def __str__(self):
        return f"Photo for {self.complaint.complaint_id}"
