
from rest_framework.routers import SimpleRouter

from apps.product.views import (
    PackageViewSet,
    DepartureViewSet,
    SupplierViewSet,
    IncludedServiceViewSet,
)

router = SimpleRouter()

router.register("packages", PackageViewSet, basename="package")
router.register("departures", DepartureViewSet, basename="departure")
router.register("suppliers", SupplierViewSet, basename="supplier")
router.register(
    "included-services",
    IncludedServiceViewSet,
    basename="included-service",
)

urlpatterns = router.urls
