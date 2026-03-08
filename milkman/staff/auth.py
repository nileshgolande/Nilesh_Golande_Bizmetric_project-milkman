from typing import Tuple, Optional, Any
from django.core import signing
from rest_framework.authentication import BaseAuthentication
from rest_framework import exceptions
from .models import Staff
from customer.models import Customer

SALT = "milkman-auth"
TOKEN_MAX_AGE = 60 * 60 * 24


def create_auth_token(entity: object, role: str) -> str:
    """Create a signed token for any entity (Staff or Customer) with a role."""
    payload = {"id": entity.pk, "email": getattr(entity, 'email', ''), "role": role}
    return signing.dumps(payload, salt=SALT)


def verify_auth_token(token: str) -> dict:
    try:
        return signing.loads(token, salt=SALT, max_age=TOKEN_MAX_AGE)
    except signing.SignatureExpired:
        raise exceptions.AuthenticationFailed("Token expired")
    except signing.BadSignature:
        raise exceptions.AuthenticationFailed("Invalid token")


class StaffTokenAuthentication(BaseAuthentication):
    def authenticate(self, request) -> Optional[Tuple[Staff, dict]]:
        auth = request.headers.get("Authorization")
        if not auth:
            return None
        parts = auth.split()
        scheme = parts[0].lower() if parts else ""
        if len(parts) != 2 or scheme not in {"token", "bearer"}:
            raise exceptions.AuthenticationFailed("Invalid authorization header")
        payload: dict[str, Any] = verify_auth_token(parts[1])
        # support staff or customer
        try:
            if payload.get('role') == 'STAFF':
                staff = Staff.objects.get(pk=payload.get("id"))
                return staff, payload
            elif payload.get('role') == 'CUSTOMER':
                cust = Customer.objects.get(pk=payload.get("id"))
                return cust, payload
            else:
                raise exceptions.AuthenticationFailed("User role not supported")
        except (Staff.DoesNotExist, Customer.DoesNotExist):
            raise exceptions.AuthenticationFailed("User not found")

