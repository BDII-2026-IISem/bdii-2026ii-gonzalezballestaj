
from rest_framework import viewsets
from rest_framework.permissions import AllowAny

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


class PackageViewSet(viewsets.ModelViewSet):
    queryset = Package.objects.all()
    serializer_class = PackageSerializer
    permission_classes = [AllowAny]


class DepartureViewSet(viewsets.ModelViewSet):
    queryset = Departure.objects.select_related("package").all()
    serializer_class = DepartureSerializer
    permission_classes = [AllowAny]


class SupplierViewSet(viewsets.ModelViewSet):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer
    permission_classes = [AllowAny]


class IncludedServiceViewSet(viewsets.ModelViewSet):
    queryset = IncludedService.objects.select_related(
        "package", "supplier"
    ).all()
    serializer_class = IncludedServiceSerializer
    permission_classes = [AllowAny]
