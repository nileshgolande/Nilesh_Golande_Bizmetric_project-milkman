from datetime import date

from django.db.models import Sum
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.models import User
from accounts.permissions import IsAdminRole, IsCustomerRole

from .models import (
    Bill,
    DeliverySchedule,
    Order,
    OrderItem,
    Payment,
    Product,
    Subscription,
)
from .serializers import (
    BillSerializer,
    CustomerAdminSerializer,
    DeliveryScheduleSerializer,
    OrderSerializer,
    PaymentSerializer,
    ProductSerializer,
    SubscriptionSerializer,
)
from .services import admin_analytics, dashboard_summary, generate_today_deliveries


class AdminProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().order_by("name")
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]

    @action(detail=True, methods=["patch"], url_path="availability")
    def availability(self, request, pk=None):
        product = self.get_object()
        is_available = request.data.get("is_available")
        if is_available is None:
            return Response({"detail": "is_available is required."}, status=status.HTTP_400_BAD_REQUEST)
        product.is_available = bool(is_available)
        product.save(update_fields=["is_available"])
        return Response(ProductSerializer(product).data)


class AdminCustomerViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = CustomerAdminSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]

    def get_queryset(self):
        return User.objects.filter(role=User.Role.CUSTOMER).order_by("-date_joined")

    @action(detail=True, methods=["post"])
    def activate(self, request, pk=None):
        customer = self.get_object()
        customer.is_active = True
        customer.save(update_fields=["is_active"])
        return Response({"detail": "Customer activated."})

    @action(detail=True, methods=["post"])
    def deactivate(self, request, pk=None):
        customer = self.get_object()
        customer.is_active = False
        customer.save(update_fields=["is_active"])
        return Response({"detail": "Customer deactivated."})

    @action(detail=True, methods=["get"])
    def subscriptions(self, request, pk=None):
        customer = self.get_object()
        serializer = SubscriptionSerializer(customer.subscriptions.select_related("product"), many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["get"])
    def orders(self, request, pk=None):
        customer = self.get_object()
        serializer = OrderSerializer(customer.orders.prefetch_related("items__product"), many=True)
        return Response(serializer.data)


class AdminSubscriptionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Subscription.objects.select_related("customer", "product").prefetch_related("weekdays")
    serializer_class = SubscriptionSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]

    def get_queryset(self):
        queryset = super().get_queryset()
        customer_id = self.request.query_params.get("customer_id")
        status_value = self.request.query_params.get("status")
        if customer_id:
            queryset = queryset.filter(customer_id=customer_id)
        if status_value:
            queryset = queryset.filter(status=status_value)
        return queryset


class AdminOrderViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Order.objects.select_related("customer").prefetch_related("items__product")
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]

    def get_queryset(self):
        queryset = super().get_queryset()
        delivery_date = self.request.query_params.get("delivery_date")
        customer_id = self.request.query_params.get("customer_id")
        status_value = self.request.query_params.get("status")
        if delivery_date:
            queryset = queryset.filter(delivery_date=delivery_date)
        if customer_id:
            queryset = queryset.filter(customer_id=customer_id)
        if status_value:
            queryset = queryset.filter(status=status_value)
        return queryset

    @action(detail=True, methods=["patch"], url_path="status")
    def update_status(self, request, pk=None):
        order = self.get_object()
        new_status = request.data.get("status")
        if new_status not in Order.Status.values:
            return Response({"detail": "Invalid status."}, status=status.HTTP_400_BAD_REQUEST)
        order.status = new_status
        order.save(update_fields=["status", "updated_at"])
        return Response(OrderSerializer(order).data)


class AdminPaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.select_related("order", "order__customer")
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]

    @action(detail=True, methods=["patch"], url_path="status")
    def update_status(self, request, pk=None):
        payment = self.get_object()
        new_status = request.data.get("status")
        if new_status not in Payment.Status.values:
            return Response({"detail": "Invalid payment status."}, status=status.HTTP_400_BAD_REQUEST)
        payment.status = new_status
        payment.save(update_fields=["status"])

        # Also update the order's payment status if successful
        if new_status == Payment.Status.SUCCESS:
            payment.order.payment_status = Order.PaymentStatus.PAID
            payment.order.save(update_fields=["payment_status"])

        return Response(PaymentSerializer(payment).data)


class AdminDeliveryScheduleViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = DeliverySchedule.objects.select_related("customer", "product", "subscription", "order")
    serializer_class = DeliveryScheduleSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]

    def get_queryset(self):
        queryset = super().get_queryset()
        delivery_date = self.request.query_params.get("delivery_date")
        status_value = self.request.query_params.get("status")
        if delivery_date:
            queryset = queryset.filter(delivery_date=delivery_date)
        if status_value:
            queryset = queryset.filter(status=status_value)
        return queryset

    @action(detail=True, methods=["patch"], url_path="status")
    def update_status(self, request, pk=None):
        delivery = self.get_object()
        new_status = request.data.get("status")
        notes = request.data.get("notes")
        if new_status not in DeliverySchedule.Status.values:
            return Response({"detail": "Invalid delivery status."}, status=status.HTTP_400_BAD_REQUEST)
        delivery.status = new_status
        if isinstance(notes, str):
            delivery.notes = notes
            delivery.save(update_fields=["status", "notes"])
        else:
            delivery.save(update_fields=["status"])
        return Response(DeliveryScheduleSerializer(delivery).data)


class AdminDashboardView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]

    def get(self, request):
        metrics = dashboard_summary()
        return Response(metrics)


class AdminTodayDeliveriesView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]

    def get(self, request):
        result = generate_today_deliveries()
        serializer = DeliveryScheduleSerializer(result["deliveries"], many=True)
        return Response(
            {
                "date": result["date"],
                "delivery_count": result["delivery_count"],
                "total_quantity": result["total_quantity"],
                "totals_by_product": result["totals_by_product"],
                "deliveries": serializer.data,
            }
        )


class AdminAnalyticsView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]

    def get(self, request):
        days_param = request.query_params.get("days", "60")
        try:
            days = int(days_param)
        except (TypeError, ValueError):
            return Response({"detail": "days must be a valid integer."}, status=status.HTTP_400_BAD_REQUEST)

        data = admin_analytics(days=days)
        return Response(data)


class AdminBillViewSet(viewsets.ModelViewSet):
    queryset = Bill.objects.select_related("customer", "subscription", "subscription__product")
    serializer_class = BillSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]

    @action(detail=True, methods=["patch"], url_path="status")
    def update_status(self, request, pk=None):
        bill = self.get_object()
        is_paid = request.data.get("is_paid", False)
        bill.is_paid = is_paid
        bill.save(update_fields=["is_paid"])
        return Response(BillSerializer(bill).data)


class CustomerBillViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = BillSerializer
    permission_classes = [permissions.IsAuthenticated, IsCustomerRole]

    def get_queryset(self):
        return Bill.objects.select_related("customer", "subscription", "subscription__product").filter(customer=self.request.user)


class PublicProductListView(viewsets.ReadOnlyModelViewSet):
    queryset = Product.objects.filter(is_available=True).order_by("name")
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]
    authentication_classes = []


class CustomerSubscriptionViewSet(viewsets.ModelViewSet):
    serializer_class = SubscriptionSerializer
    permission_classes = [permissions.IsAuthenticated, IsCustomerRole]

    def get_queryset(self):
        return (
            Subscription.objects.select_related("product", "customer")
            .prefetch_related("weekdays")
            .filter(customer=self.request.user)
        )

    def perform_create(self, serializer):
        subscription = serializer.save(customer=self.request.user)
        self._generate_bill(subscription)

    def _generate_bill(self, subscription):
        from datetime import timedelta
        # Default to 30 days if no end date
        end_date = subscription.end_date or (subscription.start_date + timedelta(days=30))
        days = (end_date - subscription.start_date).days + 1
        
        # Simple bill calculation based on delivery type
        # In a real app, this would be more complex (e.g., counting actual weekdays)
        if subscription.delivery_type == Subscription.DeliveryType.DAILY:
            total_days = days
        elif subscription.delivery_type == Subscription.DeliveryType.ALTERNATE:
            total_days = (days + 1) // 2
        else: # CUSTOM
            # Simplified for now: assume 5 days a week for custom
            total_days = (days * 5) // 7
            
        amount = subscription.quantity * subscription.product.price_per_unit * total_days
        
        Bill.objects.create(
            customer=subscription.customer,
            subscription=subscription,
            total_amount=amount,
            qr_code_url="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=PAYMENT_FOR_SUB_" + str(subscription.id),
            is_paid=False
        )

    @action(detail=True, methods=["post"])
    def pause(self, request, pk=None):
        subscription = self.get_object()
        subscription.status = Subscription.Status.PAUSED
        subscription.save(update_fields=["status", "updated_at"])
        return Response(SubscriptionSerializer(subscription).data)

    @action(detail=True, methods=["post"])
    def resume(self, request, pk=None):
        subscription = self.get_object()
        subscription.status = Subscription.Status.ACTIVE
        subscription.save(update_fields=["status", "updated_at"])
        return Response(SubscriptionSerializer(subscription).data)

    @action(detail=True, methods=["post"])
    def cancel(self, request, pk=None):
        subscription = self.get_object()
        subscription.status = Subscription.Status.CANCELLED
        subscription.save(update_fields=["status", "updated_at"])
        return Response(SubscriptionSerializer(subscription).data)


class CustomerOrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated, IsCustomerRole]

    def get_queryset(self):
        return Order.objects.select_related("customer").prefetch_related("items__product").filter(customer=self.request.user)

    def perform_create(self, serializer):
        serializer.save(customer=self.request.user)


class CustomerDeliveryScheduleView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsCustomerRole]

    def get(self, request):
        target_date_str = request.query_params.get("date")
        target_date = date.fromisoformat(target_date_str) if target_date_str else date.today()
        generate_today_deliveries(target_date)
        queryset = DeliverySchedule.objects.filter(customer=request.user, delivery_date=target_date).select_related("product")
        serializer = DeliveryScheduleSerializer(queryset, many=True)
        total_quantity = queryset.aggregate(total=Sum("quantity"))["total"] or 0
        return Response({"date": target_date, "total_quantity": total_quantity, "deliveries": serializer.data})
