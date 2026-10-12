
from rest_framework import status
from rest_framework.test import APITestCase


class SaleAPITests(APITestCase):
    def test_list_bookings(self):
        response = self.client.get("/api/sale/bookings/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_list_payments(self):
        response = self.client.get("/api/sale/payments/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_list_cancellations(self):
        response = self.client.get("/api/sale/cancellations/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_list_vouchers(self):
        response = self.client.get("/api/sale/vouchers/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
