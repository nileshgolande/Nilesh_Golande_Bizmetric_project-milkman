"""
URL configuration for milkman project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path
from .views import CustomerViewSet, CustomerRegisterView, CustomerLoginView, CustomerOrderView, StaffOrderHistoryView

urlpatterns = [
    path('customer/', CustomerViewSet.as_view(), name='customer-list'),
    path('customer/<int:pk>/', CustomerViewSet.as_view(), name='customer-detail'),
    path('register/', CustomerRegisterView.as_view(), name='customer-register'),
    path('login/', CustomerLoginView.as_view(), name='customer-login'),
    path('order/', CustomerOrderView.as_view(), name='customer-order'),
    path('order-history/', StaffOrderHistoryView.as_view(), name='order-history'),
]
