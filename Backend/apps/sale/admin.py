
from django.contrib import admin

from .models import Booking, Payment, Cancellation, Voucher


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "client",
        "departure",
        "traveler",
        "start_date",
        "end_date",
        "status",
    )
    list_filter = ("status", "start_date", "end_date")
    search_fields = (
        "client__name",
        "client__document_number",
        "traveler__name",
        "departure__name",
    )
    ordering = ("-created_at",)
    readonly_fields = ("created_at", "updated_at")


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "booking",
        "reference_type",
        "method",
        "amount",
        "payment_date",
        "status",
    )
    list_filter = ("status", "method", "payment_date")
    search_fields = (
        "booking__client__name",
        "booking__client__document_number",
        "reference_type",
    )
    ordering = ("-payment_date",)
    readonly_fields = (
        "booking",
        "reference_type",
        "method",
        "amount",
        "payment_date",
        "status",
        "created_at",
        "updated_at",
    )

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(Cancellation)
class CancellationAdmin(admin.ModelAdmin):
    list_display = ("id", "status", "created_at")
    list_filter = ("status",)
    ordering = ("-created_at",)
    readonly_fields = ("created_at", "updated_at")


@admin.register(Voucher)
class VoucherAdmin(admin.ModelAdmin):
    list_display = ("id", "status", "created_at")
    list_filter = ("status",)
    ordering = ("-created_at",)
    readonly_fields = ("created_at", "updated_at")
