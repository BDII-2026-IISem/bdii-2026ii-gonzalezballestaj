from django.utils import timezone
from rest_framework import viewsets
from rest_framework.generics import ListAPIView
from rest_framework.permissions import AllowAny
from apps.security.permissions import HasResourceAccess
from apps.common.status import RecordStatus
from apps.product.models import (
    Package,
    Departure,
    Supplier,
    IncludedService,
)
from apps.product.serializers import (
    PackageSerializer,
    DepartureSerializer,
    SupplierSerializer,
    IncludedServiceSerializer,
)


class SoftDeleteMixin:
    """Al recibir DELETE, marca el registro como inactivo en lugar de borrarlo."""

    def perform_destroy(self, instance):
        instance.status = RecordStatus.INACTIVE
        instance.save(update_fields=["status", "updated_at"])


class PackageViewSet(SoftDeleteMixin, viewsets.ModelViewSet):
    queryset = Package.objects.all()
    serializer_class = PackageSerializer
    permission_classes = [HasResourceAccess]


class DepartureViewSet(SoftDeleteMixin, viewsets.ModelViewSet):
    queryset = Departure.objects.select_related("package").all()
    serializer_class = DepartureSerializer
    permission_classes = [HasResourceAccess]


class SupplierViewSet(SoftDeleteMixin, viewsets.ModelViewSet):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer
    permission_classes = [HasResourceAccess]


class IncludedServiceViewSet(viewsets.ModelViewSet):
    queryset = IncludedService.objects.select_related(
        "package", "supplier"
    ).all()
    serializer_class = IncludedServiceSerializer
    permission_classes = [HasResourceAccess]


class AvailablePackageListAPIView(ListAPIView):
    serializer_class = PackageSerializer
    permission_classes = [HasResourceAccess]

    def get_queryset(self):
        return Package.objects.filter(
            status=RecordStatus.ACTIVE,
            departures__available_capacity__gt=0,
            departures__departure_date__gte=timezone.now(),
        ).distinct()
