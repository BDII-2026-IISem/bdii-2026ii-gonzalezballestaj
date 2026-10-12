from django.core.validators import MinLengthValidator, MinValueValidator
from django.db import models

from apps.common.models import Wayuutravel


class Package(Wayuutravel):
    name = models.CharField(
        max_length=100,
        unique=True,
        validators=[MinLengthValidator(2)]
    )
    description = models.CharField(
        max_length=255,
        null=True,
        blank=True
    )

    class Meta:
        db_table = "packages"
        verbose_name = "paquete turístico"
        verbose_name_plural = "paquetes turísticos"
        ordering = ["name", "id"]
        constraints = [
            Wayuutravel.status_constraint("packages_status_valid")
        ]

    def __str__(self):
        return self.name


class Departure(Wayuutravel):
    name = models.CharField(
        max_length=100,
        validators=[MinLengthValidator(2)]
    )
    description = models.CharField(
        max_length=255,
        null=True,
        blank=True
    )
    package = models.ForeignKey(
        Package,
        on_delete=models.PROTECT,
        related_name="departures",
        db_column="package_id"
    )
    departure_date = models.DateTimeField()
    capacity = models.PositiveIntegerField(
        validators=[MinValueValidator(1)]
    )
    available_capacity = models.PositiveIntegerField(
        validators=[MinValueValidator(0)]
    )

    class Meta:
        db_table = "departures"
        verbose_name = "salida programada"
        verbose_name_plural = "salidas programadas"
        ordering = ["departure_date", "id"]
        constraints = [
            Wayuutravel.status_constraint("departures_status_valid"),
            models.CheckConstraint(
                condition=models.Q(available_capacity__lte=models.F("capacity")),
                name="departures_available_lte_capacity"
            ),
        ]

    def __str__(self):
        return f"{self.name} - {self.departure_date:%Y-%m-%d}"


class Supplier(Wayuutravel):
    nit = models.CharField(
        max_length=20,
        unique=True
    )
    razon_social = models.CharField(
        max_length=150
    )
    phone = models.CharField(
        max_length=20
    )
    email = models.EmailField(
        max_length=254,
        null=True,
        blank=True
    )

    class Meta:
        db_table = "suppliers"
        verbose_name = "proveedor"
        verbose_name_plural = "proveedores"
        ordering = ["razon_social", "id"]
        constraints = [
            Wayuutravel.status_constraint("suppliers_status_valid")
        ]

    def __str__(self):
        return self.razon_social


class IncludedService(Wayuutravel):
    package = models.ForeignKey(
        Package,
        on_delete=models.PROTECT,
        related_name="included_services",
        db_column="package_id"
    )
    supplier = models.ForeignKey(
        Supplier,
        on_delete=models.PROTECT,
        related_name="included_services",
        db_column="supplier_id"
    )
    relation_data = models.JSONField(
        null=True,
        blank=True
    )

    class Meta:
        db_table = "included_services"
        verbose_name = "servicio incluido"
        verbose_name_plural = "servicios incluidos"
        ordering = ["package_id", "supplier_id", "id"]
        constraints = [
            Wayuutravel.status_constraint(
                "included_services_status_valid"
            ),
            models.UniqueConstraint(
                fields=["package", "supplier"],
                name="included_services_package_supplier_unique"
            ),
        ]

    def __str__(self):
        return f"{self.supplier} - {self.package}"
