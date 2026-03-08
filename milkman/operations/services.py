from collections import defaultdict
from datetime import date, timedelta
from decimal import Decimal

from django.db import transaction
from django.db.models import Sum

from accounts.models import User
from .models import DeliverySchedule, Order, Subscription


def _subscription_delivers_on(subscription: Subscription, target_date: date) -> bool:
    if subscription.status != Subscription.Status.ACTIVE:
        return False
    if target_date < subscription.start_date:
        return False
    if subscription.end_date and target_date > subscription.end_date:
        return False

    if subscription.delivery_type == Subscription.DeliveryType.DAILY:
        return True
    if subscription.delivery_type == Subscription.DeliveryType.ALTERNATE:
        return (target_date - subscription.start_date).days % 2 == 0
    return subscription.weekdays.filter(weekday=target_date.weekday()).exists()


@transaction.atomic
def generate_today_deliveries(target_date: date | None = None):
    target_date = target_date or date.today()
    totals_by_product = defaultdict(Decimal)

    subscriptions = (
        Subscription.objects.select_related("customer", "product")
        .prefetch_related("weekdays")
        .filter(status=Subscription.Status.ACTIVE)
    )
    for subscription in subscriptions:
        if not _subscription_delivers_on(subscription, target_date):
            continue
        DeliverySchedule.objects.get_or_create(
            subscription=subscription,
            delivery_date=target_date,
            defaults={
                "customer": subscription.customer,
                "product": subscription.product,
                "quantity": subscription.quantity,
                "status": DeliverySchedule.Status.SCHEDULED,
            },
        )
        totals_by_product[subscription.product.name] += subscription.quantity

    pending_orders = (
        Order.objects.select_related("customer")
        .prefetch_related("items__product")
        .filter(
            delivery_date=target_date,
            status__in=[Order.Status.PENDING, Order.Status.OUT_FOR_DELIVERY],
        )
    )
    for order in pending_orders:
        for item in order.items.all():
            DeliverySchedule.objects.get_or_create(
                order=order,
                product=item.product,
                delivery_date=target_date,
                defaults={
                    "customer": order.customer,
                    "quantity": item.quantity,
                    "status": DeliverySchedule.Status.SCHEDULED,
                },
            )
            totals_by_product[item.product.name] += item.quantity

    delivery_queryset = DeliverySchedule.objects.select_related("customer", "product").filter(delivery_date=target_date)
    total_quantity = delivery_queryset.aggregate(total=Sum("quantity"))["total"] or Decimal("0")
    return {
        "date": target_date,
        "delivery_count": delivery_queryset.count(),
        "total_quantity": total_quantity,
        "totals_by_product": {key: str(value) for key, value in totals_by_product.items()},
        "deliveries": delivery_queryset,
    }


def dashboard_summary(target_date: date | None = None):
    target_date = target_date or date.today()
    today_start = target_date.replace(day=1)

    today_orders = Order.objects.filter(delivery_date=target_date)
    month_orders = Order.objects.filter(delivery_date__gte=today_start, delivery_date__lte=target_date)

    return {
        "total_customers": User.objects.filter(role=User.Role.CUSTOMER).count(),
        "active_subscriptions": Subscription.objects.filter(status=Subscription.Status.ACTIVE).count(),
        "today_deliveries_count": DeliverySchedule.objects.filter(delivery_date=target_date).count(),
        "today_total_quantity": DeliverySchedule.objects.filter(delivery_date=target_date).aggregate(total=Sum("quantity"))[
            "total"
        ]
        or Decimal("0"),
        "today_revenue": today_orders.aggregate(total=Sum("total_amount"))["total"] or Decimal("0"),
        "monthly_revenue": month_orders.aggregate(total=Sum("total_amount"))["total"] or Decimal("0"),
    }


def admin_analytics(days: int = 60, target_date: date | None = None):
    target_date = target_date or date.today()
    days = max(1, min(days, 365))
    start_date = target_date - timedelta(days=days - 1)

    analytics = []
    totals = {
        "deliveries_count": 0,
        "total_quantity": Decimal("0"),
        "revenue": Decimal("0"),
        "new_subscriptions": 0,
        "new_customers": 0,
    }

    for offset in range(days):
        day = start_date + timedelta(days=offset)
        deliveries_qs = DeliverySchedule.objects.filter(delivery_date=day)
        orders_qs = Order.objects.filter(delivery_date=day)
        subscriptions_qs = Subscription.objects.filter(created_at__date=day)
        customers_qs = User.objects.filter(role=User.Role.CUSTOMER, date_joined__date=day)

        deliveries_count = deliveries_qs.count()
        total_quantity = deliveries_qs.aggregate(total=Sum("quantity"))["total"] or Decimal("0")
        revenue = orders_qs.aggregate(total=Sum("total_amount"))["total"] or Decimal("0")
        new_subscriptions = subscriptions_qs.count()
        new_customers = customers_qs.count()

        totals["deliveries_count"] += deliveries_count
        totals["total_quantity"] += total_quantity
        totals["revenue"] += revenue
        totals["new_subscriptions"] += new_subscriptions
        totals["new_customers"] += new_customers

        analytics.append(
            {
                "date": str(day),
                "deliveries_count": deliveries_count,
                "total_quantity": str(total_quantity),
                "revenue": str(revenue),
                "new_subscriptions": new_subscriptions,
                "new_customers": new_customers,
            }
        )

    return {
        "days": days,
        "start_date": str(start_date),
        "end_date": str(target_date),
        "totals": {
            "deliveries_count": totals["deliveries_count"],
            "total_quantity": str(totals["total_quantity"]),
            "revenue": str(totals["revenue"]),
            "new_subscriptions": totals["new_subscriptions"],
            "new_customers": totals["new_customers"],
        },
        "series": analytics,
    }
