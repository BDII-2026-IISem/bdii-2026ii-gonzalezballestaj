
from datetime import timedelta
from decimal import Decimal

from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from apps.product.models import (
    Package,
    Departure,
    Supplier,
    IncludedService,
)


class ProductAPITests(APITestCase):
    def setUp(self):
        self.package = Package.objects.create(
            name="Tour Cabo de la Vela",
            description="Experiencia turística en La Guajira",
        )

        self.supplier = Supplier.objects.create(
            nit="900123456-7",
            razon_social="Operador Turístico Wayuu",
            phone="3001234567",
            email="operador@example.com",
        )

        self.departure = Departure.objects.create(
            name="Salida Cabo de la Vela",
            description="Salida de prueba",
            package=self.package,
            departure_date=timezone.now() + timedelta(days=7),
            capacity=20,
            available_capacity=15,
        )

    def test_list_packages(self):
        response = self.client.get("/api/product/packages/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_package(self):
        data = {
            "name": "Tour Punta Gallinas",
            "description": "Recorrido turístico de prueba",
        }

        response = self.client.post(
            "/api/product/packages/",
            data,
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )
        self.assertTrue(
            Package.objects.filter(name="Tour Punta Gallinas").exists()
        )

    def test_list_departures(self):
        response = self.client.get("/api/product/departures/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_list_suppliers(self):
        response = self.client.get("/api/product/suppliers/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_list_included_services(self):
        response = self.client.get(
            "/api/product/included-services/"
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
