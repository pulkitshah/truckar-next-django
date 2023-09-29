"""
Tests for models.
"""
from decimal import Decimal

from django.test import TestCase
from django.contrib.auth import get_user_model

from core import models


class ModelTests(TestCase):
    """Test models."""

    def test_create_user_with_email_successful(self):
        """Test creating a user with an email is successful."""
        email = 'test@example.com'
        password = 'testpass123'
        user = get_user_model().objects.create_user(
            email=email,
            password=password,
        )

        self.assertEqual(user.email, email)
        self.assertTrue(user.check_password(password))

    def test_new_user_email_normalized(self):
        """Test email is normalized for new users."""
        sample_emails = [
            ['test1@EXAMPLE.com', 'test1@example.com'],
            ['Test2@Example.com', 'Test2@example.com'],
            ['TEST3@EXAMPLE.com', 'TEST3@example.com'],
            ['test4@example.COM', 'test4@example.com'],
        ]
        for email, expected in sample_emails:
            user = get_user_model().objects.create_user(email, 'sample123')
            self.assertEqual(user.email, expected)

    def test_new_user_without_email_raises_error(self):
        """Test that creating a user without an email raises a ValueError."""
        with self.assertRaises(ValueError):
            get_user_model().objects.create_user('', 'test123')

    def test_create_superuser(self):
        """Test creating a superuser."""
        user = get_user_model().objects.create_superuser(
            'test@example.com',
            'test123',
        )

        self.assertTrue(user.is_superuser)
        self.assertTrue(user.is_staff)

    def test_create_organisation(self):
        """Test creating a organisation is successful."""
        user = get_user_model().objects.create_user(
            'test@example.com',
            'testpass123',
        )
        organisation = models.Organisation.objects.create(
            user=user,
            name='MCL Freight',
            initials='MF',
            addressLine1="Office No 506, 5th Floo",
            addressLine2="Silk Route, Dr Ambedkar Chowk, 150 Ft Ring Road, Mavadi",
            city='Rajkot',
            pincode='360004',
            contact="+91 9924168484, +91 9067223628, +91 9265539533",
            email="bkp.mclrkt@gmail.com, ravimclrkt@gmail.com",
            gstin='24AVYPP6798H1ZG',
            pan='AVYPP6798H1',
            invoiceTermsAndConditions='"Enclosed Original sign by Ack\nPlease make all payments by A/c payee\ncheque/DD drawn in favour of MCL Freight only\nagainst official money receipt.\nInterest @18% per annum will be charged on all\noutstanding bills.\n"',
            # lrTermsAndConditions='lrTermsAndConditions',
            bankAccountNumber='624805500690',
            bankName='ICICI',
            bankBranchName='Kalawad Road, Rajkot',
            bankIFSC='ICIC0006248',
            logo='cc7ef833-129b-44d4-b24c-8817e832f5b9_organisationLogo_aea2b7e7-149d-44d2-b62c-7cf17bdaa98b',
        )

        self.assertEqual(str(organisation), organisation.name)
