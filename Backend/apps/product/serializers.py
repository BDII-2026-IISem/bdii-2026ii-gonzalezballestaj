
from rest_framework import serializers

from apps.product.models import Package, Departure, Supplier, IncludedService


class PackageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Package
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


class DepartureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Departure
        fields = [
            "id",
            "name",
            "description",
            "package",
            "departure_date",
            "capacity",
            "available_capacity",
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
            "capacity": {"min_value": 1},
            "available_capacity": {"min_value": 0},
        }

    def validate(self, attrs):
        if attrs.get("description") == "":
            attrs["description"] = None

        capacity = attrs.get(
            "capacity",
            getattr(self.instance, "capacity", None),
        )
        available_capacity = attrs.get(
            "available_capacity",
            getattr(self.instance, "available_capacity", None),
        )

        if (
            capacity is not None
            and available_capacity is not None
            and available_capacity > capacity
        ):
            raise serializers.ValidationError({
                "available_capacity": (
                    "La capacidad disponible no puede superar "
                    "la capacidad total."
                )
            })

        return attrs


class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = [
            "id",
            "nit",
            "razon_social",
            "phone",
            "email",
            "status",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]
        extra_kwargs = {
            "nit": {"required": True},
            "razon_social": {"min_length": 2, "max_length": 150},
            "phone": {
                "required": False,
                "allow_null": True,
                "allow_blank": True,
            },
            "email": {
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


class IncludedServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = IncludedService
        fields = [
            "id",
            "package",
            "supplier",
            "relation_data",
            "status",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]
        extra_kwargs = {
            "relation_data": {
                "required": False,
                "allow_null": True,
            },
        }
