
from rest_framework import serializers

from apps.client.models import Client, Traveler


class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = [
            "id",
            "document_type",
            "document_number",
            "name",
            "phone",
            "email",
            "status",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]
        extra_kwargs = {
            "document_type": {"min_length": 2, "max_length": 20},
            "document_number": {"min_length": 3, "max_length": 30},
            "name": {"min_length": 2, "max_length": 150},
            "email": {
                "required": False,
                "allow_null": True,
                "allow_blank": True,
            },
            "phone": {
                "required": False,
                "allow_null": True,
                "allow_blank": True,
            },
        }

    def validate_email(self, value):
        if value is None or str(value).strip() == "":
            return None
        return value.strip().lower()

    def validate(self, attrs):
        if attrs.get("phone") == "":
            attrs["phone"] = None
        return attrs


class TravelerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Traveler
        fields = [
            "id",
            "name",
            "description",
            "status",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]
        extra_kwargs = {
            "name": {"min_length": 2, "max_length": 150},
            "description": {
                "required": False,
                "allow_null": True,
                "allow_blank": True,
            },
        }

    def validate(self, attrs):
        if attrs.get("description") == "":
            attrs["description"] = None
        return attrs
