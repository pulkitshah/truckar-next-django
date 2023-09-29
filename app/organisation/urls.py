"""
URL mappings for the organisation app.
"""
from django.urls import (
    path,
    include,
)

from rest_framework.routers import DefaultRouter

from organisation import views


router = DefaultRouter()
router.register('', views.OrganisationViewSet)

app_name = 'organisation'

urlpatterns = [
    path('', include(router.urls)),
]
