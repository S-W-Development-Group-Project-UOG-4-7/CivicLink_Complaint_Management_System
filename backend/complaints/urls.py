from django.urls import path
from . import views

urlpatterns = [
    path('', views.ComplaintListView.as_view(), name='complaint-list'),
    path('<int:pk>/', views.ComplaintDetailView.as_view(), name='complaint-detail'),
    path('<int:complaint_id>/comments/', views.ComplaintCommentListView.as_view(), name='complaint-comment-list'),
    path('comments/<int:pk>/', views.ComplaintCommentDetailView.as_view(), name='complaint-comment-detail'),
    path('<int:complaint_id>/attachments/', views.ComplaintAttachmentListView.as_view(), name='complaint-attachment-list'),
    path('attachments/<int:pk>/', views.ComplaintAttachmentDetailView.as_view(), name='complaint-attachment-detail'),
    path('statistics/', views.complaint_statistics, name='complaint-statistics'),
    path('<int:complaint_id>/assign-officer/', views.assign_officer, name='assign-officer'),
    path('<int:complaint_id>/update-status/', views.update_complaint_status, name='update-status'),
]
