from django.core.exceptions import ImproperlyConfigured
from django.test import SimpleTestCase

from rest_framework import status
from rest_framework.test import APITestCase
from apps.common.status import RecordStatus
from apps.common.testing import PASSWORD, create_active_user
from apps.security.models import RefreshToken
from apps.security.tokens import hash_token
from config.database import database_from_environ


class DatabaseSelectionTests(SimpleTestCase):
    def _env(self, engine):
        return {
            "DB_ENGINE": engine,
            "POSTGRES_DB": "wayuutravel",
            "POSTGRES_USER": "wayuutravel",
            "POSTGRES_PASSWORD": "wayuutravel",
            "POSTGRES_HOST": "127.0.0.1",
            "POSTGRES_PORT": "5432",
            "MYSQL_DB": "wayuutravel",
            "MYSQL_USER": "wayuutravel",
            "MYSQL_PASSWORD": "123456",
            "MYSQL_HOST": "127.0.0.1",
            "MYSQL_PORT": "3306",
            "MSSQL_DB": "wayuutravel",
            "MSSQL_USER": "wayuutravel",
            "MSSQL_PASSWORD": "wayuutravel",
            "MSSQL_HOST": "127.0.0.1",
            "MSSQL_PORT": "1433",
            "ORACLE_DB": "wayuutravel",
            "ORACLE_USER": "wayuutravel",
            "ORACLE_PASSWORD": "jaime123!",
            "ORACLE_HOST": "127.0.0.1",
            "ORACLE_PORT": "1521",
            "ORACLE_SERVICE_NAME": "FREEPDB1",
        }


    def test_postgresql_engine(self):
        config = database_from_environ(self._env("postgresql"))
        self.assertEqual(config["default"]["ENGINE"], "django.db.backends.postgresql")

    def test_mysql_engine(self):
        config = database_from_environ(self._env("mysql"))
        self.assertEqual(config["default"]["ENGINE"], "django.db.backends.mysql")
        self.assertEqual(config["default"]["OPTIONS"]["charset"], "utf8mb4")

    def test_mssql_engine(self):
        config = database_from_environ(self._env("mssql"))
        self.assertEqual(config["default"]["ENGINE"], "mssql")

    def test_oracle_uses_service_name(self):
        config = database_from_environ(self._env("oracle"))
        self.assertIn("SERVICE_NAME=FREEPDB1", config["default"]["NAME"])
        self.assertEqual(config["default"]["PORT"], "")

    def test_invalid_engine(self):
        with self.assertRaises(ImproperlyConfigured):
            database_from_environ({"DB_ENGINE": "sqlite"})

    def test_missing_variable(self):
        env = self._env("postgresql")
        env["POSTGRES_DB"] = ""
        with self.assertRaises(ImproperlyConfigured):
            database_from_environ(env)
            
class AuthFlowTests(APITestCase):
    def setUp(self):
        self.user = create_active_user()

    def test_login_with_username_and_email(self):
        by_username = self.client.post(
            "/api/auth/login/",
            {"username": "ana", "password": PASSWORD},
            format="json",
        )

        self.assertEqual(
            by_username.status_code,
            status.HTTP_200_OK,
        )
        self.assertIn("access", by_username.data)
        self.assertIn("refresh", by_username.data)
        self.assertNotIn("password", by_username.data)

        stored = RefreshToken.objects.get()
        self.assertEqual(
            stored.token_hash,
            hash_token(by_username.data["refresh"]),
        )

        by_email = self.client.post(
            "/api/auth/login/",
            {
                "email": "ANA@WAYUUTRAVEL.TEST",
                "password": PASSWORD,
            },
            format="json",
        )

        self.assertEqual(
            by_email.status_code,
            status.HTTP_200_OK,
        )

    def test_inactive_user_and_bad_password_are_401(self):
        self.user.status = RecordStatus.INACTIVE
        self.user.save()

        inactive = self.client.post(
            "/api/auth/login/",
            {"username": "ana", "password": PASSWORD},
            format="json",
        )

        self.assertEqual(
            inactive.status_code,
            status.HTTP_401_UNAUTHORIZED,
        )

        self.user.status = RecordStatus.ACTIVE
        self.user.save()

        wrong_password = self.client.post(
            "/api/auth/login/",
            {"username": "ana", "password": "ClaveIncorrecta-999"},
            format="json",
        )

        self.assertEqual(
            wrong_password.status_code,
            status.HTTP_401_UNAUTHORIZED,
        )

        self.assertEqual(
            inactive.data["detail"],
            wrong_password.data["detail"],
        )





    def test_refresh_rotates_and_reuse_revokes_family(self):
        login = self.client.post(
            "/api/auth/login/",
            {"username": "ana", "password": PASSWORD},
            format="json",
        )
        self.assertEqual(login.status_code, status.HTTP_200_OK)

        first = login.data["refresh"]

        rotated = self.client.post(
            "/api/auth/refresh/",
            {"refresh": first},
            format="json",
        )
        self.assertEqual(rotated.status_code, status.HTTP_200_OK)

        second = rotated.data["refresh"]
        self.assertNotEqual(first, second)

        reused = self.client.post(
            "/api/auth/refresh/",
            {"refresh": first},
            format="json",
        )
        self.assertEqual(
            reused.status_code,
            status.HTTP_401_UNAUTHORIZED,
        )

        after_reuse = self.client.post(
            "/api/auth/refresh/",
            {"refresh": second},
            format="json",
        )
        self.assertEqual(
            after_reuse.status_code,
            status.HTTP_401_UNAUTHORIZED,
        )
