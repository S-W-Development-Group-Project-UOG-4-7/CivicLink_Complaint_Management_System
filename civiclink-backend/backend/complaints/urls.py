from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import CitizenViewSet, ComplaintViewSet
from .views_me import MeView

router = DefaultRouter()
router.register(r'citizens', CitizenViewSet, basename='citizens')
router.register(r'complaints', ComplaintViewSet, basename='complaints')

urlpatterns = [
    path('me/', MeView.as_view(), name='me'),
]

urlpatterns += router.urls
