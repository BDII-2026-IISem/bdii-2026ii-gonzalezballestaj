
import uuid
import re
from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import AccessToken
from drf_spectacular.utils import extend_schema
from django.db import transaction
from django.utils import timezone
from apps.security.serializers import RefreshSerializer
from apps.common.status import RecordStatus
from apps.security.models import RefreshToken, ResourceRole
from apps.security.serializers import LoginSerializer, TokenPairSerializer
from apps.security.tokens import generate_refresh_value, hash_token
from apps.security.serializers import LogoutSerializer

User = get_user_model()


def token_payload(user, raw_refresh):
    access = AccessToken.for_user(user)
    lifetime = int(
        settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"].total_seconds()
    )

    return {
        "access": str(access),
        "refresh": raw_refresh,
        "token_type": "Bearer",
        "access_expires_in": lifetime,
    }


def issue_refresh(user, family_id=None):
    raw_refresh = generate_refresh_value()

    stored = RefreshToken.objects.create(
        user=user,
        token_hash=hash_token(raw_refresh),
        family_id=family_id or uuid.uuid4(),
        expires_at=RefreshToken.default_expiry(),
        status=RecordStatus.ACTIVE,
    )

    return stored, raw_refresh


class LoginAPIView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    @extend_schema(
        request=LoginSerializer,
        responses={200: TokenPairSerializer},
        description=(
            "Inicia sesión mediante username o email y devuelve "
            "un access token y un refresh token."
        ),
        tags=["Autenticación"],
    )
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        user = _find_user(data.get("username"), data.get("email"))

        invalid = Response(
            {"detail": "Credenciales inválidas."},
            status=status.HTTP_401_UNAUTHORIZED,
        )

        if user is None or user.status != RecordStatus.ACTIVE:
            return invalid

        if not user.check_password(data["password"]):
            return invalid

        _stored, raw_refresh = issue_refresh(user)

        return Response(
            token_payload(user, raw_refresh),
            status=status.HTTP_200_OK,
        )


def _find_user(username, email):
    if username and email:
        return User.objects.filter(
            username=username,
            email__iexact=email,
        ).first()

    if username:
        return User.objects.filter(username=username).first()

    if email:
        return User.objects.filter(email__iexact=email).first()

    return None

class RefreshAPIView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    @extend_schema(
        request=RefreshSerializer,
        responses={200: TokenPairSerializer},
        description=(
            "Renueva los tokens mediante un refresh token, "
            "aplica rotación y revoca la familia si detecta reutilización."
        ),
        tags=["Autenticación"],
    )
    def post(self, request):
        serializer = RefreshSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        raw_refresh = serializer.validated_data["refresh"]

        invalid = Response(
            {"detail": "Refresh token inválido o no vigente."},
            status=status.HTTP_401_UNAUTHORIZED,
        )

        with transaction.atomic():
            stored = (
                RefreshToken.objects
                .select_for_update()
                .filter(token_hash=hash_token(raw_refresh))
                .first()
            )

            if stored is None:
                return invalid

            # Un token reemplazado indica posible reutilización.
            if (
                stored.replaced_by_id is not None
                or stored.status != RecordStatus.ACTIVE
            ):
                RefreshToken.objects.filter(
                    family_id=stored.family_id
                ).update(status=RecordStatus.INACTIVE)

                return invalid

            # Un token vencido no provoca la revocación de la familia.
            if stored.expires_at <= timezone.now():
                stored.status = RecordStatus.INACTIVE
                stored.save(update_fields=["status"])
                return invalid

            # No se permite renovar la sesión de un usuario inactiv o.
            if stored.user.status != RecordStatus.ACTIVE:
                stored.status = RecordStatus.INACTIVE
                stored.save(update_fields=["status"])
                return invalid

            # Emite el nuevo refresh dentro de la misma familia.
            new_stored, new_raw_refresh = issue_refresh(
                stored.user,
                family_id=stored.family_id,
            )

            # Marca el token anterior como reemplazado.
            stored.replaced_by = new_stored
            stored.status = RecordStatus.INACTIVE
            stored.save(
                update_fields=["replaced_by", "status"]
            )

            payload = token_payload(
                stored.user,
                new_raw_refresh,
            )

        return Response(payload, status=status.HTTP_200_OK)

class LogoutAPIView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    @extend_schema(
        request=LogoutSerializer,
        responses={204: None, 401: None},
        description=(
            "Cierra la sesión invalidando el refresh token presentado. "
            "Si detecta un token reemplazado, revoca su familia."
        ),
        tags=["Autenticación"],
    )
    def post(self, request):
        serializer = LogoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        raw_refresh = serializer.validated_data["refresh"]

        invalid = Response(
            {"detail": "Refresh token inválido."},
            status=status.HTTP_401_UNAUTHORIZED,
        )

        with transaction.atomic():
            stored = (
                RefreshToken.objects
                .select_for_update()
                .filter(token_hash=hash_token(raw_refresh))
                .first()
            )

            if stored is None:
                return invalid

            now = timezone.now()

            # Un token ya reemplazado indica posible reutilización.
            if stored.replaced_by_id is not None:
                RefreshToken.objects.filter(
                    family_id=stored.family_id
                ).update(
                    status=RecordStatus.INACTIVE,
                    revoked_at=now,
                )
                return invalid

            # Invalidar el refresh presentado.
            stored.status = RecordStatus.INACTIVE
            stored.revoked_at = now
            stored.save(
                update_fields=["status", "revoked_at"]
            )

        return Response(status=status.HTTP_204_NO_CONTENT)


_CONVERTER = re.compile(r"<[^>]+>")
_NAMED_GROUP = re.compile(r"\(\?P<[^>]+>[^)]*\)")


def to_client_path(route):
    """
    Traduce la ruta guardada en Resource a la forma que usa el frontend.

    'api/clients/<int:pk>/'                  -> '/api/clients/:id/'
    'api/product/packages/(?P<pk>[^/.]+)/$'  -> '/api/product/packages/:id/'
    """
    path = _NAMED_GROUP.sub(":id", route)
    path = _CONVERTER.sub(":id", path)
    path = path.replace("^", "").replace("$", "")
    return "/" + path.lstrip("/")


def effective_permissions(user):
    """Matriz de permisos efectivos: los mismos filtros que aplica HasResourceAccess."""
    if getattr(user, "status", None) != RecordStatus.ACTIVE:
        return []

    grants = (
        ResourceRole.objects.filter(
            status=RecordStatus.ACTIVE,
            resource__status=RecordStatus.ACTIVE,
            role__status=RecordStatus.ACTIVE,
            role__assignments__user=user,
            role__assignments__status=RecordStatus.ACTIVE,
        )
        .select_related("resource", "role")
        .distinct()
        .order_by("resource__route", "resource__method", "role__name")
    )

    return [
        {
            "method": grant.resource.method.upper(),
            "path": to_client_path(grant.resource.route),
            "role_id": grant.role_id,
            "role_name": grant.role.name,
        }
        for grant in grants
    ]


class PermissionsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        description=(
            "Devuelve la matriz de permisos efectivos del usuario autenticado: "
            "método, ruta y rol que concede cada operación."
        ),
        tags=["Autenticación"],
    )
    def get(self, request):
        return Response(
            {"permissions": effective_permissions(request.user)},
            status=status.HTTP_200_OK,
        )
    def get(self, request):
        user = request.user

        if getattr(user, "status", None) != RecordStatus.ACTIVE:
            return Response({"permissions": []}, status=status.HTTP_200_OK)

        grants = (
            ResourceRole.objects.filter(
                status=RecordStatus.ACTIVE,
                resource__status=RecordStatus.ACTIVE,
                role__status=RecordStatus.ACTIVE,
                role__assignments__user=user,
                role__assignments__status=RecordStatus.ACTIVE,
            )
            .select_related("resource", "role")
            .distinct()
            .order_by("resource__route", "resource__method", "role__name")
        )

        permissions = [
            {
                "method": grant.resource.method.upper(),
                "path": to_client_path(grant.resource.route),
                "role_id": grant.role_id,
                "role_name": grant.role.name,
            }
            for grant in grants
        ]

        return Response({"permissions": permissions}, status=status.HTTP_200_OK)
