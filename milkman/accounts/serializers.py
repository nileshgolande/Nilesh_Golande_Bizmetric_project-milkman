from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.utils.encoding import force_bytes, force_str
from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed, ValidationError

from .jwt_utils import create_jwt_token
from .models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "name", "email", "mobile", "address", "role", "is_active", "date_joined"]
        read_only_fields = ["id", "role", "date_joined"]


class CustomerRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ["name", "email", "mobile", "address", "password"]

    def create(self, validated_data):
        return User.objects.create_user(role=User.Role.CUSTOMER, **validated_data)


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs["email"].strip().lower()
        password = attrs["password"]
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist as exc:
            raise AuthenticationFailed("Invalid email or password.") from exc

        if not user.check_password(password):
            raise AuthenticationFailed("Invalid email or password.")
        if not user.is_active:
            raise AuthenticationFailed("Account is inactive.")

        attrs["user"] = user
        return attrs

    def to_representation(self, instance):
        user = instance["user"]
        return {
            "token": create_jwt_token(user, token_type="access", ttl_seconds=60 * 60 * 24),
            "user": UserSerializer(user).data,
        }


class AdminSetupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    setup_key = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["name", "email", "mobile", "address", "password", "setup_key"]

    def validate_setup_key(self, value):
        if value != getattr(settings, "ADMIN_SETUP_KEY", "CHANGE_ME_SETUP_KEY"):
            raise serializers.ValidationError("Invalid setup key.")
        return value

    def validate(self, attrs):
        if User.objects.filter(role=User.Role.ADMIN).exists():
            raise serializers.ValidationError("Admin is already configured.")
        return attrs

    def create(self, validated_data):
        validated_data.pop("setup_key")
        return User.objects.create_user(role=User.Role.ADMIN, **validated_data)


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        if not User.objects.filter(email=value).exists():
            # Still return success to avoid user enumeration
            pass
        return value


class PasswordResetConfirmSerializer(serializers.Serializer):
    uidb64 = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(write_only=True, min_length=6)

    def validate(self, attrs):
        try:
            uid = force_str(urlsafe_base64_decode(attrs["uidb64"]))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            raise ValidationError("Invalid link.")

        if not default_token_generator.check_token(user, attrs["token"]):
            raise ValidationError("Invalid or expired token.")

        attrs["user"] = user
        return attrs

    def save(self):
        user = self.validated_data["user"]
        user.set_password(self.validated_data["new_password"])
        user.save()
        return user
