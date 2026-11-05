from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import serializers

from apps.client.models import Client
from apps.security.models import (
    Resource,
    ResourceRole,
    Role,
    RoleUser,
    User,
)


class ProfileSerializer(serializers.ModelSerializer):
    # Ficha de cliente vinculada; nulo para el personal de la agencia.
    client_id = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "status",
            "is_superuser",
            "is_staff",
            "client_id",
        )
        read_only_fields = ("id", "username", "status")

    def get_client_id(self, obj):
        client = getattr(obj, "client_profile", None)
        return client.id if client is not None else None


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=False, allow_blank=False)
    email = serializers.EmailField(required=False)
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        if not attrs.get("username") and not attrs.get("email"):
            raise serializers.ValidationError(
                "Informe username o email junto con password."
            )
        return attrs


class RefreshSerializer(serializers.Serializer):
    refresh = serializers.CharField()


class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()


class TokenPairSerializer(serializers.Serializer):
    access = serializers.CharField()
    refresh = serializers.CharField()
    token_type = serializers.CharField()
    access_expires_in = serializers.IntegerField()


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=False,
        validators=[validate_password],
    )

    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "password",
            "status",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "created_at", "updated_at")

    def validate_password(self, value):
        try:
            validate_password(value, self.instance)
        except DjangoValidationError as exc:
            raise serializers.ValidationError(exc.messages)
        return value

    def create(self, validated_data):
        password = validated_data.pop("password", None)
        user = User(**validated_data)

        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()

        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop("password", None)

        for attribute, value in validated_data.items():
            setattr(instance, attribute, value)

        if password:
            instance.set_password(password)

        instance.save()
        return instance


class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = (
            "id",
            "name",
            "description",
            "status",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "created_at", "updated_at")


class RoleUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoleUser
        fields = (
            "id",
            "role",
            "user",
            "status",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "created_at", "updated_at")


class ResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resource
        fields = (
            "id",
            "name",
            "method",
            "route",
            "status",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "created_at", "updated_at")


class ResourceRoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResourceRole
        fields = (
            "id",
            "resource",
            "role",
            "status",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "created_at", "updated_at")


class RegisterSerializer(serializers.Serializer):
    """Registro público de un cliente: cuenta de usuario + ficha de cliente."""

    username = serializers.CharField(min_length=3, max_length=150)
    email = serializers.EmailField(max_length=254)
    password = serializers.CharField(write_only=True, min_length=8)
    document_type = serializers.CharField(min_length=2, max_length=20)
    document_number = serializers.CharField(min_length=3, max_length=30)
    name = serializers.CharField(min_length=2, max_length=150)
    phone = serializers.CharField(
        max_length=20, required=False, allow_blank=True, allow_null=True
    )

    def validate_username(self, value):
        value = value.strip()
        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError("Ese nombre de usuario ya está registrado.")
        return value

    def validate_email(self, value):
        value = value.strip().lower()
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("Ya existe una cuenta con ese correo.")
        return value

    def validate_document_number(self, value):
        value = value.strip()
        client = Client.objects.filter(document_number=value).first()
        if client is not None and client.user_id is not None:
            raise serializers.ValidationError(
                "Ese documento ya tiene una cuenta. Inicia sesión."
            )
        return value

    def validate(self, attrs):
        try:
            validate_password(attrs["password"])
        except DjangoValidationError as exc:
            raise serializers.ValidationError({"password": list(exc.messages)})

        other = Client.objects.filter(email__iexact=attrs["email"]).exclude(
            document_number=attrs["document_number"]
        )
        if other.exists():
            raise serializers.ValidationError(
                {"email": ["Ese correo pertenece a otro cliente."]}
            )

        attrs["document_type"] = attrs["document_type"].strip().upper()
        attrs["name"] = attrs["name"].strip()
        attrs["phone"] = (attrs.get("phone") or "").strip() or None
        return attrs