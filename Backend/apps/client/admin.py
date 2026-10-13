
from django.contrib import admin
from .models import Client


@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = (
        "document_type",
        "document_number",
        "name",
        "phone",
        "email",
        "status",
    )
    search_fields = (
        "document_number",
        "name",
        "email",
        "phone",
    )
    list_filter = ("status",)
    ordering = ("name",)
