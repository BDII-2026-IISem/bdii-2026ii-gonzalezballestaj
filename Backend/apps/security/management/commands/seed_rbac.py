
from django.core.management.base import BaseCommand, CommandError
from django.urls import Resolver404, resolve

from apps.common.status import RecordStatus
from apps.security.models import (
    HttpMethod,
    Resource,
    ResourceRole,
    Role,
    RoleUser,
    User,
)


SAMPLE_ROUTES = [
    # Clientes: /api/
    ("GET", "/api/clients/"),
    ("POST", "/api/clients/"),
    ("GET", "/api/clients/1/"),
    ("PUT", "/api/clients/1/"),
    ("PATCH", "/api/clients/1/"),
    ("DELETE", "/api/clients/1/"),

    # Paquetes: /api/product/
    ("GET", "/api/product/packages/"),
    ("POST", "/api/product/packages/"),
    ("GET", "/api/product/packages/1/"),
    ("PUT", "/api/product/packages/1/"),
    ("PATCH", "/api/product/packages/1/"),
    ("DELETE", "/api/product/packages/1/"),
    ("GET", "/api/product/packages/available/"),

    # Salidas
    ("GET", "/api/product/departures/"),
    ("POST", "/api/product/departures/"),
    ("GET", "/api/product/departures/1/"),
    ("PUT", "/api/product/departures/1/"),
    ("PATCH", "/api/product/departures/1/"),
    ("DELETE", "/api/product/departures/1/"),

    # Proveedores
    ("GET", "/api/product/suppliers/"),
    ("POST", "/api/product/suppliers/"),
    ("GET", "/api/product/suppliers/1/"),
    ("PUT", "/api/product/suppliers/1/"),
    ("PATCH", "/api/product/suppliers/1/"),
    ("DELETE", "/api/product/suppliers/1/"),

    # Servicios incluidos
    ("GET", "/api/product/included-services/"),
    ("POST", "/api/product/included-services/"),
    ("GET", "/api/product/included-services/1/"),
    ("PUT", "/api/product/included-services/1/"),
    ("PATCH", "/api/product/included-services/1/"),
    ("DELETE", "/api/product/included-services/1/"),

    # Reservas, pagos, cancelaciones y comprobantes: /api/sale/
    *[
        (method, f"/api/sale/{resource}/")
        for resource in (
            "bookings",
            "payments",
            "cancellations",
            "vouchers",
        )
        for method in ("GET", "POST")
    ],
    *[
        (method, f"/api/sale/{resource}/1/")
        for resource in (
            "bookings",
            "payments",
            "cancellations",
            "vouchers",
        )
        for method in ("GET", "PUT", "PATCH", "DELETE")
    ],
    ("POST", "/api/sale/bookings/register/"),

    # Administración de seguridad: /api/
    *[
        (method, f"/api/{resource}/")
        for resource in (
            "users",
            "roles",
            "role-users",
            "resources",
            "resource-roles",
        )
        for method in ("GET", "POST")
    ],
    *[
        (method, f"/api/{resource}/1/")
        for resource in (
            "users",
            "roles",
            "role-users",
            "resources",
            "resource-roles",
        )
        for method in ("GET", "PUT", "PATCH", "DELETE")
    ],

    # Autenticación
    ("POST", "/api/auth/login/"),
    ("POST", "/api/auth/refresh/"),
    ("POST", "/api/auth/logout/"),
    ("GET", "/api/auth/profile/"),
]


class Command(BaseCommand):
    help = "Sincroniza los recursos y permisos de la matriz RBAC."

    def add_arguments(self, parser):
        parser.add_argument(
            "--username",
            type=str,
            help="Usuario al que se asignará el rol admin.",
        )

    def handle(self, *args, **options):
        username = options.get("username")

        # Validar primero al usuario para evitar cambios parciales.
        user = None
        if username:
            try:
                user = User.objects.get(username=username)
            except User.DoesNotExist as exc:
                raise CommandError(
                    f"No existe el usuario '{username}'. Créalo primero."
                ) from exc

        role, _ = Role.objects.get_or_create(
            name="admin",
            defaults={
                "description": "Administrador del sistema",
                "status": RecordStatus.ACTIVE,
            },
        )

        if role.status != RecordStatus.ACTIVE:
            role.status = RecordStatus.ACTIVE
            role.save(update_fields=["status", "updated_at"])

        created_resources = 0
        created_grants = 0

        for method, sample_path in SAMPLE_ROUTES:
            if method not in HttpMethod.values:
                raise CommandError(f"Método HTTP no válido: {method}")

            try:
                route = resolve(sample_path).route
            except Resolver404 as exc:
                raise CommandError(
                    f"No se encontró una ruta para {method} {sample_path}. "
                    "Comprueba los prefijos en config/urls.py y las rutas "
                    "registradas en cada aplicación."
                ) from exc

            resource, resource_created = Resource.objects.get_or_create(
                method=method,
                route=route,
                defaults={
                    "name": f"{method} {route}",
                    "status": RecordStatus.ACTIVE,
                },
            )

            if resource_created:
                created_resources += 1

            resource_changes = []

            if resource.status != RecordStatus.ACTIVE:
                resource.status = RecordStatus.ACTIVE
                resource_changes.append("status")

            if not resource.name:
                resource.name = f"{method} {route}"
                resource_changes.append("name")

            if resource_changes:
                resource.save(
                    update_fields=[*resource_changes, "updated_at"]
                )

            grant, grant_created = ResourceRole.objects.get_or_create(
                resource=resource,
                role=role,
                defaults={"status": RecordStatus.ACTIVE},
            )

            if grant_created:
                created_grants += 1
            elif grant.status != RecordStatus.ACTIVE:
                grant.status = RecordStatus.ACTIVE
                grant.save(update_fields=["status", "updated_at"])

        if user is not None:
            assignment, _ = RoleUser.objects.get_or_create(
                user=user,
                role=role,
                defaults={"status": RecordStatus.ACTIVE},
            )
            

            if assignment.status != RecordStatus.ACTIVE:
                assignment.status = RecordStatus.ACTIVE
                assignment.save(update_fields=["status", "updated_at"])

        self.stdout.write(
            self.style.SUCCESS(
                "Recursos RBAC sincronizados correctamente. "
                f"Recursos nuevos: {created_resources}. "
                f"Permisos nuevos: {created_grants}."
            )
        )


