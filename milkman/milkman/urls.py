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
from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse


# Custom admin site: allow any authenticated user (not only is_staff)
class AuthAdminSite(admin.AdminSite):
    def has_permission(self, request):
        return bool(request.user and request.user.is_active and request.user.is_authenticated)


# Create and install our admin site so app `admin.py` registrations attach to it
admin_site = AuthAdminSite(name='admin')
admin.site = admin_site
admin.autodiscover()

urlpatterns = [
    path('admin/', admin_site.urls),
    path('api/auth/', include('staff.auth_urls')),
    path('api/staff/', include('staff.urls')),
    path('api/customer/', include('customer.urls')),
    path('api/category/', include('category.urls')),
    path('api/product/', include('product.urls')),
    path('api/subscription/', include('subscription.urls')),
    path('staff/', include('staff.urls')),
    path('customer/', include('customer.urls')),
    path('category/', include('category.urls')),
    path('product/', include('product.urls')),
    path('subscription/', include('subscription.urls')),
    path('', lambda request: JsonResponse({
        "status": "ok",
        "message": "Milkman API is running",
    }), name='home'),
]
