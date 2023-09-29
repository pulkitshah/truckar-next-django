"""
Views for the organisation APIs
"""
from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from core.models import Organisation
from organisation import serializers


class OrganisationViewSet(viewsets.ModelViewSet):
    """View for manage organisation APIs."""
    serializer_class = serializers.OrganisationDetailSerializer
    queryset = Organisation.objects.all()
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Retrieve organisations for authenticated user."""
        return self.queryset.filter(user=self.request.user).order_by('-id')

    def get_serializer_class(self):
        """Return the serializer class for request."""
        if self.action == 'list':
            return serializers.OrganisationSerializer

        return self.serializer_class

    def perform_create(self, serializer):
        """Create a new organisation."""
        serializer.save(user=self.request.user)