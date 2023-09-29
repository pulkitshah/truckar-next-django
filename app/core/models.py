"""
Database models.
"""
from django.conf import settings
from django.contrib.postgres.fields import (ArrayField)
from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)


def get_default_lrSettings():
    return [
        {
            "lrFormatFileName":  "standard-loose",
            "isDefault": True,
        },
    ]


class UserManager(BaseUserManager):
    """Manager for users."""

    def create_user(self, email, password=None, **extra_fields):
        """Create, save and return a new user."""
        if not email:
            raise ValueError("User must have an email address")
        user = self.model(email=self.normalize_email(email), **extra_fields)
        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, email, password):
        """Create and return a new superuser."""
        user = self.create_user(email, password)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)

        return user


class User(AbstractBaseUser, PermissionsMixin):
    """User in the system."""
    email = models.EmailField(max_length=255, unique=True)
    name = models.CharField(max_length=255)
    mobile = models.CharField(max_length=12)
    onBoardingRequired = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'email'


class Account(models.Model):
    """Account object."""
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
    )
    name = models.CharField(max_length=255)
    orderExpensesSettings = ArrayField(models.JSONField(), blank=True)
    lrSettings = ArrayField(models.JSONField(), default=get_default_lrSettings)
    taxOptions = ArrayField(models.JSONField(), blank=True)
    lrFormat = models.CharField(max_length=255)
    invoiceFormat = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.user


class Organisation(models.Model):
    """Organisation object."""
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
    )
    name = models.CharField(max_length=255)
    initials = models.CharField(max_length=255)
    addressLine1 = models.CharField(max_length=255)
    addressLine2 = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=255)
    pincode = models.CharField(max_length=255)
    contact = models.CharField(max_length=255, blank=True)
    email = models.CharField(max_length=255, blank=True)
    gstin = models.CharField(max_length=255, blank=True)
    pan = models.CharField(max_length=255, blank=True)
    invoiceTermsAndConditions = models.TextField(max_length=255, blank=True)
    lrTermsAndConditions = models.TextField(max_length=255, blank=True)
    bankAccountNumber = models.CharField(max_length=255, blank=True)
    bankName = models.CharField(max_length=255, blank=True)
    bankBranchName = models.CharField(max_length=255, blank=True)
    bankIFSC = models.CharField(max_length=255, blank=True)
    logo = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return self.name
