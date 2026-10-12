
from django.core.exceptions import ValidationError
from django.db import models, transaction

from apps.common.status import RecordStatus
from apps.client.models import Client, Traveler
from apps.product.models import Departure


class BookingManager(models.Manager):
    """Manager personalizado para las reservas de Wayuu Travel."""

    def register(
        self,
        *,
        client_id,
        departure_id,
        traveler_id,
        start_date,
        end_date,
        payments,
        observations=None,
    ):
        if not payments:
            raise ValidationError({
                "payments": ["La reserva requiere al menos un pago."]
            })

        with transaction.atomic():
            # Bloquear y validar el cliente.
            try:
                client = Client.objects.select_for_update().get(
                    pk=client_id
                )
            except Client.DoesNotExist:
                raise ValidationError({
                    "client_id": ["El cliente no existe."]
                })

            if client.status != RecordStatus.ACTIVE:
                raise ValidationError({
                    "client_id": ["El cliente debe estar activo."]
                })

            # Bloquear y validar la salida.
            try:
                departure = Departure.objects.select_for_update().get(
                    pk=departure_id
                )
            except Departure.DoesNotExist:
                raise ValidationError({
                    "departure_id": ["La salida programada no existe."]
                })

            if departure.status != RecordStatus.ACTIVE:
                raise ValidationError({
                    "departure_id": ["La salida debe estar activa."]
                })

            if departure.available_capacity < 1:
                raise ValidationError({
                    "departure_id": ["No hay cupos disponibles."]
                })

            # Validar el viajero.
            try:
                traveler = Traveler.objects.get(pk=traveler_id)
            except Traveler.DoesNotExist:
                raise ValidationError({
                    "traveler_id": ["El viajero no existe."]
                })

            # Crear la reserva.
            booking = self.model(
                client=client,
                departure=departure,
                traveler=traveler,
                start_date=start_date,
                end_date=end_date,
                observations=observations,
                status=RecordStatus.INACTIVE,
            )
            booking.save()

            # Crear los pagos dentro de la misma transacción.
            from apps.sale.models import Payment

            for payment_data in payments:
                Payment.objects.create(
                    booking=booking,
                    reference_type=payment_data["reference_type"],
                    method=payment_data["method"],
                    amount=payment_data["amount"],
                    payment_date=payment_data["payment_date"],
                    status=RecordStatus.ACTIVE,
                )

            # Confirmar reserva y descontar un cupo.
            booking.status = RecordStatus.ACTIVE
            booking.save(update_fields=["status", "updated_at"])

            departure.available_capacity -= 1
            departure.save(
                update_fields=["available_capacity", "updated_at"]
            )

            return booking
