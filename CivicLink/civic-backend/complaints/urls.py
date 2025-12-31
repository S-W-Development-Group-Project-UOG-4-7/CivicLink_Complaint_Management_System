from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Create a router and register our viewsets
router = DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'departments', views.DepartmentViewSet)
router.register(r'officers', views.OfficerViewSet)
router.register(r'complaints', views.ComplaintViewSet)

# API URL patterns
urlpatterns = [
    # Authentication endpoints
    path('auth/admin/login/', views.admin_login, name='admin_login'),
    path('auth/officer/login/', views.officer_login, name='officer_login'),
    path('auth/logout/', views.admin_logout, name='logout'),
    
    # Admin dashboard endpoints
    path('admin/dashboard/stats/', views.admin_dashboard_stats, name='admin_dashboard_stats'),
    path('admin/recent-complaints/', views.recent_complaints, name='recent_complaints'),
    
    # API endpoints
    path('api/', include(router.urls)),
]
