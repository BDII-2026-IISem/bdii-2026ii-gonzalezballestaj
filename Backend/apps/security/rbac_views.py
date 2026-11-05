
from rest_framework.generics import RetrieveUpdateAPIView
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from rest_framework.decorators import action
from rest_framework.response import Response
from apps.security.auth_views import effective_permissions
from apps.security.serializers import ProfileSerializer
from rest_framework import viewsets
from apps.common.status import RecordStatus
from apps.security.models import ( Resource,ResourceRole,Role,RoleUser,User,)
from apps.security.permissions import HasResourceAccess
from apps.security.serializers import (ResourceRoleSerializer,ResourceSerializer, RoleSerializer, RoleUserSerializer, UserSerializer,)

class ProfileAPIView(RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ["get", "patch", "head", "options"]

    def get_object(self):
        return self.request.user




class SoftDeleteModelViewSet(viewsets.ModelViewSet):
    http_method_names = [
        "get",
        "post",
        "put",
        "patch",
        "delete",
        "head",
        "options",
    ]
    permission_classes = [IsAuthenticated, HasResourceAccess]

    def get_queryset(self):
        queryset = super().get_queryset()
        status_value = self.request.query_params.get("status")

            
        if status_value == "all":
            return queryset

        if status_value:
            return queryset.filter(status=status_value)

        return queryset.filter(status=RecordStatus.ACTIVE)

    def perform_destroy(self, instance):
        instance.status = RecordStatus.INACTIVE
        instance.save()


class UserViewSet(SoftDeleteModelViewSet):
    queryset = User.objects.all().order_by("id")
    serializer_class = UserSerializer

    @action(detail=True, methods=["get"], url_path="permissions")
    def user_permissions(self, request, pk=None):
        """Permisos efectivos de un usuario, activo o no."""
        user = get_object_or_404(User, pk=pk)
        return Response({"permissions": effective_permissions(user)})

class RoleViewSet(SoftDeleteModelViewSet):
    queryset = Role.objects.all().order_by("id")
    serializer_class = RoleSerializer


class RoleUserViewSet(SoftDeleteModelViewSet):
    queryset = RoleUser.objects.all().order_by("id")
    serializer_class = RoleUserSerializer


class ResourceViewSet(SoftDeleteModelViewSet):
    queryset = Resource.objects.all().order_by("id")
    serializer_class = ResourceSerializer


class ResourceRoleViewSet(SoftDeleteModelViewSet):
    queryset = ResourceRole.objects.all().order_by("id")
    serializer_class = ResourceRoleSerializer
   