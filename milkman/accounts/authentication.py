from rest_framework import authentication
from rest_framework.exceptions import AuthenticationFailed

from .jwt_utils import decode_jwt_token
from .models import User


class JWTAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get("Authorization", "")
        if not auth_header:
            return None

        parts = auth_header.split()
        if len(parts) != 2 or parts[0].lower() != "bearer":
            raise AuthenticationFailed("Invalid Authorization header.")

        payload = decode_jwt_token(parts[1])
        if payload.get("type") != "access":
            raise AuthenticationFailed("Unsupported token type.")

        try:
            user = User.objects.get(pk=payload.get("sub"), is_active=True)
        except User.DoesNotExist as exc:
            raise AuthenticationFailed("User not found or inactive.") from exc

        return user, payload
