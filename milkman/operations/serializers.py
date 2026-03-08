import os
import uuid
from decimal import Decimal

from django.core.files.storage import default_storage
from django.db import transaction
from rest_framework import serializers

from accounts.models import User

from .models import (
    Bill,
    DeliverySchedule,
    Order,
    OrderItem,
    Payment,
    Product,
    Subscription,
    SubscriptionSchedule,
)


class ProductSerializer(serializers.ModelSerializer):
    image_file = serializers.ImageField(write_only=True, required=False, allow_null=True)

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "category",
            "price_per_unit",
            "unit",
            "image",
            "image_file",
            "is_available",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def _make_absolute_url(self, value: str) -> str:
        if not value:
            return value
        if value.startswith("http://") or value.startswith("https://") or value.startswith("data:"):
            return value
        request = self.context.get("request")
        if request:
            return request.build_absolute_uri(value)
        return value

    def _store_image_file(self, image_file) -> str:
        extension = os.path.splitext(image_file.name)[1] or ".jpg"
        file_name = f"products/{uuid.uuid4().hex}{extension}"
        stored_path = default_storage.save(file_name, image_file)
        file_url = default_storage.url(stored_path)
        return self._make_absolute_url(file_url)

    def create(self, validated_data):
        image_file = validated_data.pop("image_file", None)
        if image_file:
            validated_data["image"] = self._store_image_file(image_file)
        return super().create(validated_data)

    def update(self, instance, validated_data):
        image_file = validated_data.pop("image_file", None)
        if image_file:
            validated_data["image"] = self._store_image_file(image_file)
        return super().update(instance, validated_data)

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        image_value = representation.get("image", "")
        representation["image"] = self._make_absolute_url(image_value)
        return representation


class CustomerAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "name", "email", "mobile", "address", "is_active", "date_joined"]
        read_only_fields = ["id", "date_joined"]


class SubscriptionSerializer(serializers.ModelSerializer):
    weekdays = serializers.ListField(
        child=serializers.IntegerField(min_value=0, max_value=6),
        write_only=True,
        required=False,
    )
    weekdays_display = serializers.SerializerMethodField(read_only=True)
    customer_name = serializers.CharField(source="customer.name", read_only=True)
    product_name = serializers.CharField(source="product.name", read_only=True)

    class Meta:
        model = Subscription
        fields = [
            "id",
            "customer",
            "customer_name",
            "product",
            "product_name",
            "quantity",
            "delivery_type",
            "start_date",
            "end_date",
            "status",
            "weekdays",
            "weekdays_display",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["customer", "created_at", "updated_at"]

    def get_weekdays_display(self, obj):
        return list(obj.weekdays.values_list("weekday", flat=True))

    def validate(self, attrs):
        delivery_type = attrs.get("delivery_type", getattr(self.instance, "delivery_type", None))
        weekdays = attrs.get("weekdays")
        if delivery_type == Subscription.DeliveryType.CUSTOM and not weekdays and not self.instance:
            raise serializers.ValidationError("Custom weekdays are required for CUSTOM delivery type.")
        if delivery_type != Subscription.DeliveryType.CUSTOM and weekdays:
            raise serializers.ValidationError("Weekdays are only allowed for CUSTOM delivery type.")
        start_date = attrs.get("start_date", getattr(self.instance, "start_date", None))
        end_date = attrs.get("end_date", getattr(self.instance, "end_date", None))
        if start_date and end_date and end_date < start_date:
            raise serializers.ValidationError("End date cannot be before start date.")
        return attrs

    @transaction.atomic
    def create(self, validated_data):
        weekdays = validated_data.pop("weekdays", [])
        subscription = super().create(validated_data)
        for day in sorted(set(weekdays)):
            SubscriptionSchedule.objects.create(subscription=subscription, weekday=day)
        return subscription

    @transaction.atomic
    def update(self, instance, validated_data):
        weekdays = validated_data.pop("weekdays", None)
        subscription = super().update(instance, validated_data)
        if weekdays is not None:
            subscription.weekdays.all().delete()
            for day in sorted(set(weekdays)):
                SubscriptionSchedule.objects.create(subscription=subscription, weekday=day)
        return subscription


class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name", read_only=True)

    class Meta:
        model = OrderItem
        fields = ["id", "product", "product_name", "quantity", "unit_price", "line_total"]
        read_only_fields = ["id", "unit_price", "line_total"]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    customer_name = serializers.CharField(source="customer.name", read_only=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "customer",
            "customer_name",
            "status",
            "payment_status",
            "delivery_date",
            "total_amount",
            "items",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["created_at", "updated_at", "total_amount"]

    @transaction.atomic
    def create(self, validated_data):
        items_data = validated_data.pop("items")
        order = Order.objects.create(**validated_data)
        total = Decimal("0.00")
        for item_data in items_data:
            product = item_data["product"]
            quantity = item_data["quantity"]
            unit_price = product.price_per_unit
            line_total = unit_price * quantity
            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=quantity,
                unit_price=unit_price,
                line_total=line_total,
            )
            total += line_total
        order.total_amount = total
        order.save(update_fields=["total_amount"])
        Payment.objects.get_or_create(order=order, defaults={"amount": total})
        return order


class DeliveryScheduleSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source="customer.name", read_only=True)
    customer_mobile = serializers.CharField(source="customer.mobile", read_only=True)
    customer_address = serializers.CharField(source="customer.address", read_only=True)
    product_name = serializers.CharField(source="product.name", read_only=True)

    class Meta:
        model = DeliverySchedule
        fields = [
            "id",
            "customer",
            "customer_name",
            "customer_mobile",
            "customer_address",
            "subscription",
            "order",
            "product",
            "product_name",
            "quantity",
            "delivery_date",
            "status",
            "notes",
        ]


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = "__all__"


class BillSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source="customer.name", read_only=True)
    product_name = serializers.CharField(source="subscription.product.name", read_only=True)

    class Meta:
        model = Bill
        fields = [
            "id",
            "customer",
            "customer_name",
            "subscription",
            "product_name",
            "total_amount",
            "qr_code_url",
            "is_paid",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]
