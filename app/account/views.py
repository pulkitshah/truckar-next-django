"""
Views for the account APIs
"""
from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from core.models import Account
from account import serializers


class AccountViewSet(viewsets.ModelViewSet):
    """View for manage account APIs."""
    serializer_class = serializers.AccountDetailSerializer
    queryset = Account.objects.all()
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Retrieve accounts for authenticated user."""
        return self.queryset.filter(user=self.request.user).order_by('-id')

    def get_serializer_class(self):
        """Return the serializer class for request."""
        if self.action == 'list':
            return serializers.AccountSerializer

        return self.serializer_class

    def perform_create(self, serializer):
        """Create a new account."""
        serializer.save(user=self.request.user)