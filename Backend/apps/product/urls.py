
from rest_framework.routers import DefaultRouter

from apps.product.views import (
    PackageViewSet,
    DepartureViewSet,
    SupplierViewSet,
    IncludedServiceViewSet,
)

router = DefaultRouter()

router.register(r"packages", PackageViewSet, basename="package")
router.register(r"departures", DepartureViewSet, basename="departure")
router.register(r"suppliers", SupplierViewSet, basename="supplier")
router.register(
    r"included-services",
    IncludedServiceViewSet,
    basename="included-service",
)

urlpatterns = router.urls
