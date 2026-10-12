
from django.core.validators import MinLengthValidator
from django.db import models

from apps.common.models import Wayuutravel


class Client(Wayuutravel):
    document_type = models.CharField(
        max_length=20,
        validators=[MinLengthValidator(2)]
    )

    document_number = models.CharField(
        max_length=30,
        unique=True,
        validators=[MinLengthValidator(3)]
    )

    name = models.CharField(
        max_length=150,
        validators=[MinLengthValidator(2)]
    )

    phone = models.CharField(
        max_length=20,
        blank=True,
        null=True
    )

    email = models.EmailField(
        max_length=254,
        blank=True,
        null=True,
        unique=True
    )

    class Meta:
        db_table = "clients"
        constraints = [
            Wayuutravel.status_constraint("clients")
        ]

    def __str__(self):
        return f"{self.name} - {self.document_number}"


class Traveler(Wayuutravel):
    name = models.CharField(
        max_length=150,
        validators=[MinLengthValidator(2)]
    )

    description = models.TextField(
        blank=True,
        null=True
    )

    class Meta:
        db_table = "travelers"
        constraints = [
            Wayuutravel.status_constraint("travelers")
        ]

    def __str__(self):
        return self.name
