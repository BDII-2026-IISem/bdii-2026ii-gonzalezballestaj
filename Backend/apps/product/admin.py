
from django.contrib import admin

from .models import Package, Departure, Supplier, IncludedService


@admin.register(Package)
class PackageAdmin(admin.ModelAdmin):
    list_display = ("name", "status")
    list_filter = ("status",)
    search_fields = ("name", "description")
    ordering = ("name",)


@admin.register(Departure)
class DepartureAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "package",
        "departure_date",
        "capacity",
        "available_capacity",
        "status",
    )
    list_filter = ("status", "departure_date")
    search_fields = ("name", "package__name")
    ordering = ("departure_date",)

@admin.register(Supplier)
class SupplierAdmin(admin.ModelAdmin):
    list_display = (
        "nit",
        "razon_social",
        "phone",
        "email",
        "status",
    )
    list_filter = ("status",)
    search_fields = ("nit", "razon_social", "phone", "email")
    ordering = ("razon_social",)
    readonly_fields = ("created_at", "updated_at")


@admin.register(IncludedService)
class IncludedServiceAdmin(admin.ModelAdmin):
    list_display = (
        "package",
        "supplier",
        "status",
    )
    list_filter = ("status", "package", "supplier")
    search_fields = ("package__name", "supplier__razon_social")
    ordering = ("package", "supplier")
    readonly_fields = ("created_at", "updated_at")
