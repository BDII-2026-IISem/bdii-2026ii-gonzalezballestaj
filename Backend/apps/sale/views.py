from django.core.exceptions import ValidationError as DjangoValidationError

from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.generics import ListAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from apps.common.status import RecordStatus

from drf_spectacular.utils import extend_schema # type: ignore

from apps.sale.models import (Booking,Payment,Cancellation,Voucher)
from apps.sale.serializers import (
    BookingSerializer,
    PaymentSerializer,
    CancellationSerializer,
    CancellationRequestSerializer,
    VoucherSerializer,

)


class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [AllowAny]
    http_method_names = ["get", "post", "put", "patch", "head", "options"]

    
    @action(detail=True, methods=["post"], url_path="cancel")
    def cancel(self, request, pk=None):
        """Cancela una reserva y devuelve el cupo correspondiente."""

        serializer = CancellationRequestSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        try:
            cancellation = Booking.objects.cancel(
                booking_id=pk,
                name=serializer.validated_data["name"],
                descriptions=serializer.validated_data.get("descriptions"),
            )

        except DjangoValidationError as exc:
            if hasattr(exc, "message_dict"):
                errors = exc.message_dict
            else:
                errors = {"detail": exc.messages}

            return Response(
                errors,
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            CancellationSerializer(cancellation).data,
            status=status.HTTP_201_CREATED,
        )


class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [AllowAny]


class CancellationViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Cancellation.objects.all()
    serializer_class = CancellationSerializer
    permission_classes = [AllowAny]


class VoucherViewSet(viewsets.ModelViewSet):
    queryset = Voucher.objects.all()
    serializer_class = VoucherSerializer
    permission_classes = [AllowAny]
    
    def perform_destroy(self, instance):
        instance.status = RecordStatus.INACTIVE
        instance.save(update_fields=["status", "updated_at"])


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