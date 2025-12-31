from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.AdminLoginView.as_view(), name='admin-login'),
    path('logout/', views.AdminLogoutView.as_view(), name='admin-logout'),
    path('dashboard/', views.AdminDashboardView.as_view(), name='admin-dashboard'),
    path('profile/', views.AdminProfileView.as_view(), name='admin-profile'),
    path('officers/', views.OfficerListView.as_view(), name='officer-list'),
    path('officers/<int:pk>/', views.OfficerDetailView.as_view(), name='officer-detail'),
    path('officers/register/', views.OfficerRegistrationView.as_view(), name='officer-register'),
]
