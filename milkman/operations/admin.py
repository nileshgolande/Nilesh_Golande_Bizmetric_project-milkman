from django.contrib import admin

from .models import DeliverySchedule, Order, OrderItem, Payment, Product, Subscription, SubscriptionSchedule


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ["name", "category", "price_per_unit", "unit", "is_available"]
    list_filter = ["category", "unit", "is_available"]
    search_fields = ["name", "category"]


class SubscriptionScheduleInline(admin.TabularInline):
    model = SubscriptionSchedule
    extra = 0


@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ["id", "customer", "product", "quantity", "delivery_type", "status", "start_date"]
    list_filter = ["delivery_type", "status", "start_date"]
    inlines = [SubscriptionScheduleInline]


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ["unit_price", "line_total"]


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ["id", "customer", "status", "payment_status", "delivery_date", "total_amount", "created_at"]
    list_filter = ["status", "payment_status", "delivery_date"]
    inlines = [OrderItemInline]


@admin.register(DeliverySchedule)
class DeliveryScheduleAdmin(admin.ModelAdmin):
    list_display = ["delivery_date", "customer", "product", "quantity", "status"]
    list_filter = ["delivery_date", "status", "product"]
    search_fields = ["customer__name", "customer__email", "customer__mobile"]


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ["order", "method", "status", "amount", "transaction_ref", "created_at"]
    list_filter = ["method", "status", "created_at"]
