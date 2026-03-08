from django.urls import path
from .views import UnifiedLoginView, AdminRegistrationView, CustomerRegistrationView

urlpatterns = [
    path('login/', UnifiedLoginView.as_view(), name='unified-login'),
    path('register/admin/', AdminRegistrationView.as_view(), name='admin-register'),
    path('register/customer/', CustomerRegistrationView.as_view(), name='customer-register'),
]
