from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    AdminDeliveryScheduleViewSet,
    AdminCustomerViewSet,
    AdminDashboardView,
    AdminAnalyticsView,
    AdminOrderViewSet,
    AdminPaymentViewSet,
    AdminProductViewSet,
    AdminSubscriptionViewSet,
    AdminTodayDeliveriesView,
    AdminBillViewSet,
    CustomerDeliveryScheduleView,
    CustomerOrderViewSet,
    CustomerSubscriptionViewSet,
    CustomerBillViewSet,
    PublicProductListView,
)

admin_router = DefaultRouter()
admin_router.register("products", AdminProductViewSet, basename="admin-products")
admin_router.register("customers", AdminCustomerViewSet, basename="admin-customers")
admin_router.register("subscriptions", AdminSubscriptionViewSet, basename="admin-subscriptions")
admin_router.register("orders", AdminOrderViewSet, basename="admin-orders")
admin_router.register("payments", AdminPaymentViewSet, basename="admin-payments")
admin_router.register("deliveries", AdminDeliveryScheduleViewSet, basename="admin-deliveries")
admin_router.register("bills", AdminBillViewSet, basename="admin-bills")

customer_router = DefaultRouter()
customer_router.register("subscriptions", CustomerSubscriptionViewSet, basename="customer-subscriptions")
customer_router.register("orders", CustomerOrderViewSet, basename="customer-orders")
customer_router.register("bills", CustomerBillViewSet, basename="customer-bills")

public_router = DefaultRouter()
public_router.register("products", PublicProductListView, basename="public-products")

urlpatterns = [
    path("admin/dashboard/", AdminDashboardView.as_view(), name="admin-dashboard"),
    path("admin/analytics/", AdminAnalyticsView.as_view(), name="admin-analytics"),
    path("admin/deliveries/today/", AdminTodayDeliveriesView.as_view(), name="admin-today-deliveries"),
    path("admin/", include(admin_router.urls)),
    path("customer/deliveries/", CustomerDeliveryScheduleView.as_view(), name="customer-deliveries"),
    path("customer/", include(customer_router.urls)),
    path("public/", include(public_router.urls)),
]
