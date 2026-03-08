from django.urls import path

from .views import (
    AdminSetupView,
    CustomerRegistrationView,
    LoginView,
    ProfileView,
    PasswordResetRequestView,
    PasswordResetConfirmView,
)


urlpatterns = [
    path("admin/setup/", AdminSetupView.as_view(), name="admin-setup"),
    path("customer/register/", CustomerRegistrationView.as_view(), name="customer-register"),
    path("login/", LoginView.as_view(), name="login"),
    path("me/", ProfileView.as_view(), name="profile"),
    path("password/reset/", PasswordResetRequestView.as_view(), name="password-reset-request"),
    path("password/reset/confirm/", PasswordResetConfirmView.as_view(), name="password-reset-confirm"),
]
