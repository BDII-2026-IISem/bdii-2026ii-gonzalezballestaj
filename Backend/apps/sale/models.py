
from django.core.validators import MinValueValidator
from django.db import models
from apps.common.models import Wayuutravel
from apps.client.models import Client, Traveler
from apps.product.models import Departure
from apps.sale.managers import BookingManager


class Booking(Wayuutravel):
    objects = BookingManager()
    
    client = models.ForeignKey(
        Client,
        on_delete=models.PROTECT,
        related_name="bookings",
        db_column="client_id"
    )
    departure = models.ForeignKey(
        Departure,
        on_delete=models.PROTECT,
        related_name="bookings",
        db_column="departure_id"
    )
    traveler = models.ForeignKey(
        Traveler,
        on_delete=models.PROTECT,
        related_name="bookings",
        db_column="traveler_id"
    )
    start_date = models.DateField()
    end_date = models.DateField()
    observations = models.TextField(
        null=True,
        blank=True
    )

    class Meta:
        db_table = "bookings"
        verbose_name = "reserva"
        verbose_name_plural = "reservas"
        ordering = ["-created_at", "id"]
        constraints = [
            Wayuutravel.status_constraint("bookings_status_valid"),
            models.CheckConstraint(
                condition=models.Q(end_date__gte=models.F("start_date")),
                name="bookings_end_date_gte_start_date"
            ),
        ]

    def __str__(self):
        return f"Reserva #{self.pk}"


class Payment(Wayuutravel):
    reference_type = models.CharField(max_length=50)
    booking = models.ForeignKey(
        Booking,
        on_delete=models.PROTECT,
        related_name="payments",
        db_column="booking_id"
    )
    method = models.CharField(max_length=50)
    amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(0.01)]
    )
    payment_date = models.DateTimeField()

    class Meta:
        db_table = "payments"
        verbose_name = "pago"
        verbose_name_plural = "pagos"
        ordering = ["-payment_date", "id"]
        constraints = [
            Wayuutravel.status_constraint("payments_status_valid")
        ]

    def __str__(self):
        return f"Pago #{self.pk} - {self.amount}"


class Cancellation(Wayuutravel):
    booking = models.ForeignKey(
        Booking,
        on_delete=models.PROTECT,
        related_name="cancellations",
        db_column="booking_id"
    )
    name = models.CharField(max_length=100)
    descriptions = models.TextField(
        null=True,
        blank=True
    )

    class Meta:
        db_table = "cancellations"
        verbose_name = "cancelación"
        verbose_name_plural = "cancelaciones"
        ordering = ["-created_at", "id"]
        constraints = [
            Wayuutravel.status_constraint("cancellations_status_valid")
        ]

    def __str__(self):
        return self.name


class Voucher(Wayuutravel):
    booking = models.ForeignKey(
        Booking,
        on_delete=models.PROTECT,
        related_name="vouchers",
        db_column="booking_id"
    )
    name = models.CharField(max_length=100)
    descriptions = models.TextField(
        null=True,
        blank=True
    )

    class Meta:
        db_table = "vouchers"
        verbose_name = "comprobante"
        verbose_name_plural = "comprobantes"
        ordering = ["-created_at", "id"]
        constraints = [
            Wayuutravel.status_constraint("vouchers_status_valid")
        ]

    def __str__(self):
        return self.name
