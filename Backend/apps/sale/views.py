from django.core.exceptions import ValidationError as DjangoValidationError
from django.db import transaction
from drf_spectacular.utils import extend_schema  # type: ignore
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.client.models import Traveler
from apps.common.status import RecordStatus
from apps.sale.models import Booking, Cancellation, Payment, Voucher
from apps.sale.serializers import (
    BookingSerializer,
    CancellationRequestSerializer,
    CancellationSerializer,
    PaymentSerializer,
    VoucherSerializer,
)
from apps.security.permissions import HasResourceAccess


class ClientScopedMixin:
    """
    Un cliente con cuenta solo ve sus propios registros.
    El personal no tiene ficha de cliente vinculada y ve todo.
    """

    client_lookup = "client"

    def get_queryset(self):
        queryset = super().get_queryset()
        client = getattr(self.request.user, "client_profile", None)

        if client is not None:
            return queryset.filter(**{self.client_lookup: client})

        return queryset


def validation_errors(exc):
    """Convierte una ValidationError de Django en el cuerpo de una respuesta 400."""
    if hasattr(exc, "message_dict"):
        return exc.message_dict
    return {"detail": exc.messages}


class BookingViewSet(ClientScopedMixin, viewsets.ModelViewSet):
    client_lookup = "client"
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [HasResourceAccess]
    http_method_names = ["get", "post", "put", "patch", "head", "options"]

    @action(detail=True, methods=["post"], url_path="cancel")
    def cancel(self, request, pk=None):
        """Cancela una reserva y devuelve el cupo correspondiente."""
        booking = self.get_object()

        serializer = CancellationRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            cancellation = Booking.objects.cancel(
                booking_id=booking.pk,
                name=serializer.validated_data["name"],
                descriptions=serializer.validated_data.get("descriptions"),
            )
        except DjangoValidationError as exc:
            return Response(validation_errors(exc), status=status.HTTP_400_BAD_REQUEST)

        return Response(
            CancellationSerializer(cancellation).data,
            status=status.HTTP_201_CREATED,
        )


class PaymentViewSet(ClientScopedMixin, viewsets.ModelViewSet):
    client_lookup = "booking__client"
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [HasResourceAccess]


class CancellationViewSet(ClientScopedMixin, viewsets.ReadOnlyModelViewSet):
    client_lookup = "booking__client"
    queryset = Cancellation.objects.all()
    serializer_class = CancellationSerializer
    permission_classes = [HasResourceAccess]


class VoucherViewSet(ClientScopedMixin, viewsets.ModelViewSet):
    client_lookup = "booking__client"
    queryset = Voucher.objects.all()
    serializer_class = VoucherSerializer
    permission_classes = [HasResourceAccess]

    def perform_destroy(self, instance):
        instance.status = RecordStatus.INACTIVE
        instance.save(update_fields=["status", "updated_at"])


class ActiveBookingListView(ClientScopedMixin, ListAPIView):
    client_lookup = "client"
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [HasResourceAccess]


class BookingRegistrationAPIView(APIView):
    """Registra una reserva junto con sus pagos."""

    permission_classes = [HasResourceAccess]

    @extend_schema(
        summary="Registrar una reserva con pagos",
        description=(
            "Registra una reserva turística y los pagos enviados en la solicitud. "
            "Si quien reserva es un cliente con cuenta, la reserva queda siempre "
            "a su nombre y el viajero se crea con el nombre indicado."
        ),
        request=BookingSerializer,
        responses={201: BookingSerializer, 400: None},
        tags=["Reservas"],
    )
    def post(self, request):
        with transaction.atomic():
            data = request.data.copy()
            client = getattr(request.user, "client_profile", None)

            # Un cliente siempre reserva a su nombre: se ignoran client y traveler recibidos.
            if client is not None:
                traveler_name = (data.get("traveler_name") or client.name).strip()
                traveler = Traveler.objects.create(
                    name=traveler_name[:150],
                    description=f"Viajero registrado por el cliente {client.name}.",
                    status=RecordStatus.ACTIVE,
                )
                data["client"] = client.id
                data["traveler"] = traveler.id

            serializer = BookingSerializer(data=data)

            if not serializer.is_valid():
                transaction.set_rollback(True)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            try:
                booking = serializer.save()
            except DjangoValidationError as exc:
                transaction.set_rollback(True)
                return Response(validation_errors(exc), status=status.HTTP_400_BAD_REQUEST)

        return Response(
            BookingSerializer(booking).data,
            status=status.HTTP_201_CREATED,
        )