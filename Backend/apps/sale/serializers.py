
from rest_framework import serializers

from apps.sale.models import Booking, Payment, Cancellation, Voucher


class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = [
            "id",
            "client",
            "departure",
            "traveler",
            "start_date",
            "end_date",
            "observations",
            "status",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]
        extra_kwargs = {
            "observations": {
                "required": False,
                "allow_null": True,
                "allow_blank": True,
            },
        }

    def validate(self, attrs):
        start_date = attrs.get(
            "start_date",
            getattr(self.instance, "start_date", None),
        )
        end_date = attrs.get(
            "end_date",
            getattr(self.instance, "end_date", None),
        )

        if start_date and end_date and end_date < start_date:
            raise serializers.ValidationError({
                "end_date": (
                    "La fecha final no puede ser anterior "
                    "a la fecha de inicio."
                )
            })

        if attrs.get("observations") == "":
            attrs["observations"] = None

        return attrs


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = [
            "id",
            "booking",
            "reference_type",
            "method",
            "amount",
            "payment_date",
            "status",
        ]
        read_only_fields = ["id"]
        extra_kwargs = {
            "reference_type": {"max_length": 50},
            "method": {"max_length": 50},
            "amount": {"min_value": 0},
        }


class CancellationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cancellation
        fields = [
            "id",
            "booking",
            "name",
            "descriptions",
            "status",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]
        extra_kwargs = {
            "name": {"min_length": 2, "max_length": 100},
            "descriptions": {
                "required": False,
                "allow_null": True,
                "allow_blank": True,
            },
        }

    def validate(self, attrs):
        if attrs.get("descriptions") == "":
            attrs["descriptions"] = None
        return attrs


class VoucherSerializer(serializers.ModelSerializer):
    class Meta:
        model = Voucher
        fields = [
            "id",
            "booking",
            "name",
            "descriptions",
            "status",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]
        extra_kwargs = {
            "name": {"min_length": 2, "max_length": 100},
            "descriptions": {
                "required": False,
                "allow_null": True,
                "allow_blank": True,
            },
        }

    def validate(self, attrs):
        if attrs.get("descriptions") == "":
            attrs["descriptions"] = None
        return attrs
