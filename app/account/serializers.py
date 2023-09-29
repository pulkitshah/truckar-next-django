"""
Serializers for account APIs
"""
from rest_framework import serializers

from core.models import Account


class AccountSerializer(serializers.ModelSerializer):
    """Serializer for accounts."""

    class Meta:
        model = Account
        fields = ['id','name','onBoardingRequired','orderExpensesSettings','lrSettings','taxOptions','lrFormat','invoiceFormat','is_active']
        read_only_fields = ['id']

class AccountDetailSerializer(AccountSerializer):
    """Serializer for account detail view."""

    class Meta(AccountSerializer.Meta):
        fields = AccountSerializer.Meta.fields + ['city']