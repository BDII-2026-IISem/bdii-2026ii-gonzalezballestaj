
from django.urls import path
from rest_framework.routers import DefaultRouter

from apps.sale.views import (
    BookingViewSet,
    PaymentViewSet,
    CancellationViewSet,
    VoucherViewSet,
    BookingRegistrationAPIView,
)

router = DefaultRouter()

router.register(r"bookings", BookingViewSet, basename="booking")
router.register(r"payments", PaymentViewSet, basename="payment")
router.register(
    r"cancellations",
    CancellationViewSet,
    basename="cancellation",
)
router.register(r"vouchers", VoucherViewSet, basename="voucher")

urlpatterns = [
    path(
        "bookings/register/",
        BookingRegistrationAPIView.as_view(),
        name="booking-register",
    ),
]

urlpatterns += router.urls
