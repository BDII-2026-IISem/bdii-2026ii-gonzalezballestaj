
from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from rest_framework.generics import ListAPIView

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
