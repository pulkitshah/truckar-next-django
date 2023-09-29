"""
Serializers for organisation APIs
"""
from rest_framework import serializers

from core.models import Organisation


class OrganisationSerializer(serializers.ModelSerializer):
    """Serializer for organisations."""

    class Meta:
        model = Organisation
        fields = ['id','name','initials','addressLine1','addressLine2','pincode','contact','email','gstin','pan','invoiceTermsAndConditions','lrTermsAndConditions','bankAccountNumber','bankName','bankBranchName','bankIFSC','logo']
        read_only_fields = ['id']


class OrganisationDetailSerializer(OrganisationSerializer):
    """Serializer for organisation detail view."""

    class Meta(OrganisationSerializer.Meta):
        fields = OrganisationSerializer.Meta.fields + ['city']