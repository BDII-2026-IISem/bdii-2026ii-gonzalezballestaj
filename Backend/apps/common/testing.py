
from django.urls import resolve

from apps.common.status import RecordStatus
from apps.security.models import (
    Resource,
    ResourceRole,
    Role,
    RoleUser,
    User,
)

PASSWORD = "WayuuTravel-Test-1"


def create_active_user(
    username="ana",
    email="ana@wayuutravel.test",
    password=PASSWORD,
):
    return User.objects.create_user(
        username=username,
        email=email,
        password=password,
        status=RecordStatus.ACTIVE,
    )


def grant(user, method, path, role_name=None):
    role, _ = Role.objects.get_or_create(
        name=role_name or f"test-role-{user.pk}",
        defaults={
            "description": "Rol de prueba",
            "status": RecordStatus.ACTIVE,
        },
    )

    if role.status != RecordStatus.ACTIVE:
        role.status = RecordStatus.ACTIVE
        role.save()

    assignment, _ = RoleUser.objects.get_or_create(
        role=role,
        user=user,
        defaults={"status": RecordStatus.ACTIVE},
    )

    if assignment.status != RecordStatus.ACTIVE:
        assignment.status = RecordStatus.ACTIVE
        assignment.save()

    match = resolve(path)

    resource, _ = Resource.objects.get_or_create(
        method=method.upper(),
        route=match.route,
        defaults={
            "name": f"{method.upper()} {match.route}",
            "status": RecordStatus.ACTIVE,
        },
    )

    if resource.status != RecordStatus.ACTIVE:
        resource.status = RecordStatus.ACTIVE
        resource.save()

    resource_role, _ = ResourceRole.objects.get_or_create(
        resource=resource,
        role=role,
        defaults={"status": RecordStatus.ACTIVE},
    )

    if resource_role.status != RecordStatus.ACTIVE:
        resource_role.status = RecordStatus.ACTIVE
        resource_role.save()

    return role


def grant_crud(user, collection, detail):
    grant(user, "GET", collection)
    grant(user, "POST", collection)

    for method in ("GET", "PUT", "PATCH", "DELETE"):
        grant(user, method, detail)
