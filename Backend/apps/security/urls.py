from apps.security.auth_views import RegisterAPIView

from django.urls import path
from rest_framework.routers import SimpleRouter

from apps.security.auth_views import (
    LoginAPIView,
    LogoutAPIView,
    PermissionsAPIView,
    RefreshAPIView,
)
from apps.security.rbac_views import (
    ProfileAPIView,
    ResourceRoleViewSet,
    ResourceViewSet,
    RoleUserViewSet,
    RoleViewSet,
    UserViewSet,
)


router = SimpleRouter(use_regex_path=False)

router.register("users", UserViewSet, basename="user")
router.register("roles", RoleViewSet, basename="role")
router.register("role-users", RoleUserViewSet, basename="role-user")
router.register("resources", ResourceViewSet, basename="resource")
router.register(
    "resource-roles",
    ResourceRoleViewSet,
    basename="resource-role",
)


urlpatterns = [
    path("auth/register/", RegisterAPIView.as_view(), name="auth-register"),
    path("auth/login/", LoginAPIView.as_view(), name="auth-login"),
    path("auth/refresh/", RefreshAPIView.as_view(), name="auth-refresh"),
    path("auth/logout/", LogoutAPIView.as_view(), name="auth-logout"),
    path("auth/profile/", ProfileAPIView.as_view(), name="auth-profile"),
        path("auth/permissions/", PermissionsAPIView.as_view(), name="auth-permissions"),
]

urlpatterns += router.urls
