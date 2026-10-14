from django.core.exceptions import ImproperlyConfigured
from django.test import SimpleTestCase
from rest_framework import status
from rest_framework.test import APITestCase
from apps.common.status import RecordStatus
from apps.common.testing import PASSWORD, create_active_user
from apps.security.tokens import hash_token
from config.database import database_from_environ
from apps.security.models import ( RefreshToken,Resource,ResourceRole,Role,RoleUser,
)

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


    def test_logout_invalidates_refresh(self):
        login = self.client.post(
            "/api/auth/login/",
            {"username": "ana", "password": PASSWORD},
            format="json",
        )
        self.assertEqual(login.status_code, status.HTTP_200_OK)

        raw = login.data["refresh"]

        logout = self.client.post(
            "/api/auth/logout/",
            {"refresh": raw},
            format="json",
        )
        self.assertEqual(
            logout.status_code,
            status.HTTP_204_NO_CONTENT,
        )

        again = self.client.post(
            "/api/auth/refresh/",
            {"refresh": raw},
            format="json",
        )
        self.assertEqual(
            again.status_code,
            status.HTTP_401_UNAUTHORIZED,
        )

 
    def test_profile_requires_token_and_rejects_inactive_user(self):
        # 1. Sin token, el endpoint debe rechazar la solicitud.
        anonymous = self.client.get("/api/auth/profile/")
        self.assertEqual(
            anonymous.status_code,
            status.HTTP_401_UNAUTHORIZED,
        )

        # 2. Iniciar sesión para obtener un token.
        login = self.client.post(
            "/api/auth/login/",
            {"username": "ana", "password": PASSWORD},
            format="json",
        )
        self.assertEqual(login.status_code, status.HTTP_200_OK)

        # 3. Consultar el perfil usando el token.
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {login.data['access']}"
        )
        profile = self.client.get("/api/auth/profile/")

        self.assertEqual(profile.status_code, status.HTTP_200_OK)
        self.assertEqual(profile.data["username"], "ana")
        self.assertNotIn("password", profile.data)

        # 4. Actualizar el nombre del usuario.
        patched = self.client.patch(
            "/api/auth/profile/",
            {"firstName": "Ana"},
            format="json",
        )
        self.assertEqual(patched.status_code, status.HTTP_200_OK)

        # 5. Desactivar el usuario y verificar que pierda el acceso.
        self.user.status = RecordStatus.INACTIVE
        self.user.save()

        denied = self.client.get("/api/auth/profile/")
        self.assertEqual(
            denied.status_code,
            status.HTTP_401_UNAUTHORIZED,
        )


class RbacTests(APITestCase):
    def setUp(self):
        self.user = create_active_user(
            username="rbac_user",
            email="rbac@wayuutravel.test",
        )

        self.role = Role.objects.create(
            name="Operador RBAC",
            status=RecordStatus.ACTIVE,
        )

        self.assignment = RoleUser.objects.create(
            role=self.role,
            user=self.user,
            status=RecordStatus.ACTIVE,
        )

        self.resource = Resource.objects.create(
            name="Listar clientes",
            method="GET",
            route="api/clients/",
            status=RecordStatus.ACTIVE,
        )

        self.grant = ResourceRole.objects.create(
            resource=self.resource,
            role=self.role,
            status=RecordStatus.ACTIVE,
        )

        self.client.force_authenticate(user=self.user)

    def test_authenticated_user_without_grant_gets_403(self):
        self.grant.status = RecordStatus.INACTIVE
        self.grant.save(update_fields=["status", "updated_at"])

        response = self.client.get("/api/clients/")

        self.assertEqual(response.status_code, 403)

    def test_anonymous_user_gets_401(self):
        self.client.force_authenticate(user=None)

        response = self.client.get("/api/clients/")

        self.assertEqual(response.status_code, 401)

    def test_active_grant_allows_client_list(self):
        response = self.client.get("/api/clients/")

        self.assertEqual(response.status_code, 200)

    def test_inactive_role_denies_access(self):
        self.role.status = RecordStatus.INACTIVE
        self.role.save(update_fields=["status", "updated_at"])

        response = self.client.get("/api/clients/")

        self.assertEqual(response.status_code, 403)

    def test_inactive_role_assignment_denies_access(self):
        self.assignment.status = RecordStatus.INACTIVE
        self.assignment.save(update_fields=["status", "updated_at"])

        response = self.client.get("/api/clients/")

        self.assertEqual(response.status_code, 403)

    def test_inactive_grant_denies_access(self):
        self.grant.status = RecordStatus.INACTIVE
        self.grant.save(update_fields=["status", "updated_at"])

        response = self.client.get("/api/clients/")

        self.assertEqual(response.status_code, 403)

    def test_inactive_resource_denies_access(self):
        self.resource.status = RecordStatus.INACTIVE
        self.resource.save(update_fields=["status", "updated_at"])

        response = self.client.get("/api/clients/")

        self.assertEqual(response.status_code, 403)
