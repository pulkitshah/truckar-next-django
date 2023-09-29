"""
Tests for organisation APIs.
"""
from decimal import Decimal

from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse

from rest_framework import status
from rest_framework.test import APIClient

from core.models import Organisation

from organisation.serializers import (
    OrganisationSerializer,
    OrganisationDetailSerializer,
)

ORGANISATIONS_URL = reverse('organisation:organisation-list')

def detail_url(organisation_id):
    """Create and return a organisation detail URL."""
    return reverse('organisation:organisation-detail', args=[organisation_id])

def create_organisation(user, **params):
    """Create and return a sample organisation."""
    defaults = {
        'name':'MCL Freight',
        'initials':'MF',
        'addressLine1':"Office No 506, 5th Floo",
        'addressLine2':"Silk Route, Dr Ambedkar Chowk, 150 Ft Ring Road, Mavadi",
        'city':'Rajkot',
        'pincode':'360004',
        'contact':"+91 9924168484, +91 9067223628, +91 9265539533",
        'email':"bkp.mclrkt@gmail.com, ravimclrkt@gmail.com",
        'gstin':'24AVYPP6798H1ZG',
        'pan':'AVYPP6798H1',
        'invoiceTermsAndConditions':'"Enclosed Original sign by Ack\nPlease make all payments by A/c payee\ncheque/DD drawn in favour of MCL Freight only\nagainst official money receipt.\nInterest @18% per annum will be charged on all\noutstanding bills.\n"',
        # lrTermsAndConditions:'lrTermsAndConditions',
        'bankAccountNumber':'624805500690',
        'bankName':'ICICI',
        'bankBranchName':'Kalawad Road, Rajkot',
        'bankIFSC':'ICIC0006248',
        'logo':'cc7ef833-129b-44d4-b24c-8817e832f5b9_organisationLogo_aea2b7e7-149d-44d2-b62c-7cf17bdaa98b',
    }
    defaults.update(params)

    organisation = Organisation.objects.create(user=user, **defaults)
    return organisation

def create_user(**params):
    """Create and return a new user."""
    return get_user_model().objects.create_user(**params)


class PublicOrganisationAPITests(TestCase):
    """Test unauthenticated API requests."""

    def setUp(self):
        self.client = APIClient()

    def test_auth_required(self):
        """Test auth is required to call API."""
        res = self.client.get(ORGANISATIONS_URL)

        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)


class PrivateOrganisationApiTests(TestCase):
    """Test authenticated API requests."""

    def setUp(self):
        self.client = APIClient()
        self.user = create_user(email='user@example.com', password='test123')
        self.client.force_authenticate(self.user)

    def test_retrieve_organisations(self):
        """Test retrieving a list of organisations."""
        create_organisation(user=self.user)
        create_organisation(user=self.user)

        res = self.client.get(ORGANISATIONS_URL)

        organisations = Organisation.objects.all().order_by('-id')
        serializer = OrganisationSerializer(organisations, many=True)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, serializer.data)

    def test_organisation_list_limited_to_user(self):
        """Test list of organisations is limited to authenticated user."""
        other_user = create_user(email='other@example.com', password='test123')
        create_organisation(user=other_user)
        create_organisation(user=self.user)

        res = self.client.get(ORGANISATIONS_URL)

        organisations = Organisation.objects.filter(user=self.user)
        serializer = OrganisationSerializer(organisations, many=True)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, serializer.data)

    def test_get_organisation_detail(self):
        """Test get organisation detail."""
        organisation = create_organisation(user=self.user)

        url = detail_url(organisation.id)
        res = self.client.get(url)

        serializer = OrganisationDetailSerializer(organisation)
        self.assertEqual(res.data, serializer.data)

    def test_create_organisation(self):
        """Test creating a organisation."""
        payload = {
            'name':'MCL Freight',
            'initials':'MF',
            'addressLine1':"Office No 506, 5th Floo",
            'addressLine2':"Silk Route, Dr Ambedkar Chowk, 150 Ft Ring Road, Mavadi",
            'city':'Rajkot',
            'pincode':'360004',
            'contact':"+91 9924168484, +91 9067223628, +91 9265539533",
            'email':"bkp.mclrkt@gmail.com, ravimclrkt@gmail.com",
            'gstin':'24AVYPP6798H1ZG',
            'pan':'AVYPP6798H1',
            'invoiceTermsAndConditions':'"Enclosed Original sign by Ack\nPlease make all payments by A/c payee\ncheque/DD drawn in favour of MCL Freight only\nagainst official money receipt.\nInterest @18% per annum will be charged on all\noutstanding bills.\n"',
            # lrTermsAndConditions:'lrTermsAndConditions',
            'bankAccountNumber':'624805500690',
            'bankName':'ICICI',
            'bankBranchName':'Kalawad Road, Rajkot',
            'bankIFSC':'ICIC0006248',
            'logo':'cc7ef833-129b-44d4-b24c-8817e832f5b9_organisationLogo_aea2b7e7-149d-44d2-b62c-7cf17bdaa98b',
        }
        res = self.client.post(ORGANISATIONS_URL, payload)

        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        organisation = Organisation.objects.get(id=res.data['id'])
        for k, v in payload.items():
            self.assertEqual(getattr(organisation, k), v)
        self.assertEqual(organisation.user, self.user)

    def test_partial_update(self):
        """Test partial update of a organisation."""
        original_organisationlogo = 'cc7ef833-129b-44d4-b24c-BlahBlah-149d-44d2-b62c-7cf17bdaa98b'
        organisation = create_organisation(
            user=self.user,
            name='Sample organisation name',
            logo=original_organisationlogo,
        )

        payload = {'name': 'New organisation name'}
        url = detail_url(organisation.id)
        res = self.client.patch(url, payload)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        organisation.refresh_from_db()
        self.assertEqual(organisation.name, payload['name'])
        self.assertEqual(organisation.logo, original_organisationlogo)
        self.assertEqual(organisation.user, self.user)

    def test_full_update(self):
        """Test full update of organisation."""
        organisation = create_organisation(
            user=self.user,
            name='Sample organisation name',
        )

        payload = {
            'name':'MCL Freightsdcsdcs',
            'initials':'dddd',
            'addressLine1':"Officefcecce No 506, 5th Floo",
            'addressLine2':"Silkefcecef vecfcfrc Route, Dr Ambedkar Chowk, 150 Ft Ring Road, Mavadi",
            'city':'fcreergcerfg',
            'pincode':'3cdcdfwc60004',
            'contact':"+91 dwcedfcwdfcwef, +91 9067223628, +91 9265539533",
            'email':"bkp.wdcwecefcefc@gmail.com, wcefcwdcwefc@gmail.com",
            'gstin':'wdcfcwecwefc',
            'pan':'wecwerfcefc',
        }
        url = detail_url(organisation.id)
        res = self.client.put(url, payload)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        organisation.refresh_from_db()
        for k, v in payload.items():
            self.assertEqual(getattr(organisation, k), v)
        self.assertEqual(organisation.user, self.user)

    def test_update_user_returns_error(self):
        """Test changing the organisation user results in an error."""
        new_user = create_user(email='user2@example.com', password='test123')
        organisation = create_organisation(user=self.user)

        payload = {'user': new_user.id}
        url = detail_url(organisation.id)
        self.client.patch(url, payload)

        organisation.refresh_from_db()
        self.assertEqual(organisation.user, self.user)

    def test_delete_organisation(self):
        """Test deleting a organisation successful."""
        organisation = create_organisation(user=self.user)

        url = detail_url(organisation.id)
        res = self.client.delete(url)

        self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Organisation.objects.filter(id=organisation.id).exists())

    def test_organisation_other_users_organisation_error(self):
        """Test trying to delete another users organisation gives error."""
        new_user = create_user(email='user2@example.com', password='test123')
        organisation = create_organisation(user=new_user)

        url = detail_url(organisation.id)
        res = self.client.delete(url)

        self.assertEqual(res.status_code, status.HTTP_404_NOT_FOUND)
        self.assertTrue(Organisation.objects.filter(id=organisation.id).exists())