from django.urls import path
from . import views

urlpatterns = [
    path('', views.DepartmentListView.as_view(), name='department-list'),
    path('<int:pk>/', views.DepartmentDetailView.as_view(), name='department-detail'),
    path('<int:department_id>/services/', views.DepartmentServiceListView.as_view(), name='department-service-list'),
    path('services/<int:pk>/', views.DepartmentServiceDetailView.as_view(), name='department-service-detail'),
    path('statistics/', views.department_statistics, name='department-statistics'),
]
