
from apps.common.status import RecordStatus
from apps.security.models import User

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
