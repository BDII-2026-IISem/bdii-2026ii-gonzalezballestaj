
from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from rest_framework.generics import ListAPIView
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from drf_spectacular.utils import extend_schema

from apps.sale.models import (
    Booking,
    Payment,
    Cancellation,
    Voucher,
)
from apps.sale.serializers import (
    BookingSerializer,
    PaymentSerializer,
    CancellationSerializer,
    VoucherSerializer,
)


class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [AllowAny]


class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [AllowAny]


class CancellationViewSet(viewsets.ModelViewSet):
    queryset = Cancellation.objects.all()
    serializer_class = CancellationSerializer
    permission_classes = [AllowAny]


class VoucherViewSet(viewsets.ModelViewSet):
    queryset = Voucher.objects.all()
    serializer_class = VoucherSerializer
    permission_classes = [AllowAny]


class ActiveBookingListView(ListAPIView):
    serializer_class = BookingSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Booking.objects.all()
class BookingRegistrationAPIView(APIView):
    """Registra una reserva junto con sus pagos."""

    permission_classes = [AllowAny]

    @extend_schema(
        summary="Registrar una reserva con pagos",
        description=(
            "Registra una reserva turística y los pagos enviados "
            "en la solicitud. Devuelve la reserva creada o los "
            "errores de validación."
        ),
        request=BookingSerializer,
        responses={
            201: BookingSerializer,
            400: None,
        },
        tags=["Reservas"],
    )
    def post(self, request):
        serializer = BookingSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            booking = serializer.save()
        except DjangoValidationError as exc:
            if hasattr(exc, "message_dict"):
                errors = exc.message_dict
            else:
                errors = {"detail": exc.messages}

            return Response(
                errors,
                status=status.HTTP_400_BAD_REQUEST,
            )

        response_serializer = BookingSerializer(booking)

        return Response(
            response_serializer.data,
            status=status.HTTP_201_CREATED,
        )