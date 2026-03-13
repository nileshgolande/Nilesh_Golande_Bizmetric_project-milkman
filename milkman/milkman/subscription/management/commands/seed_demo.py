from django.core.management.base import BaseCommand
from customer.models import Customer, Order
from subscription.models import Subscription, SubscriptionPause
from product.models import Product
from datetime import date, timedelta
from decimal import Decimal


class Command(BaseCommand):
    def handle(self, *args, **options):
        customers = [
            {"name": "Alice", "email": "alice@example.com", "password": "pass123", "phone": "1111111111", "address": "A Street"},
            {"name": "Bob", "email": "bob@example.com", "password": "pass123", "phone": "2222222222", "address": "B Street"},
        ]
        created_customers = []
        for c in customers:
            obj, _ = Customer.objects.get_or_create(email=c["email"], defaults=c)
            created_customers.append(obj)

        names = ["Whole Milk 1L", "Badam Milk 250ml", "Paneer 200g"]
        products = {p.name: p for p in Product.objects.filter(name__in=names)}

        subs_created = 0
        for cust in created_customers:
            if "Whole Milk 1L" in products:
                s1, created = Subscription.objects.get_or_create(
                    customer=cust,
                    product=products["Whole Milk 1L"],
                    defaults={"quantity": 1, "frequency": "daily", "is_active": True},
                )
                if created:
                    subs_created += 1
                SubscriptionPause.objects.get_or_create(subscription=s1, date=date.today() + timedelta(days=1))
            if "Badam Milk 250ml" in products:
                s2, created = Subscription.objects.get_or_create(
                    customer=cust,
                    product=products["Badam Milk 250ml"],
                    defaults={"quantity": 1, "frequency": "weekly", "is_active": True},
                )
                if created:
                    subs_created += 1

        orders_created = 0
        if "Paneer 200g" in products:
            p = products["Paneer 200g"]
            for cust in created_customers:
                total = Decimal(p.price) * Decimal(1)
                o, created = Order.objects.get_or_create(
                    customer=cust, product=p, quantity=1, total_price=total
                )
                if created:
                    orders_created += 1

        self.stdout.write(self.style.SUCCESS(f"Seeded {len(created_customers)} customers, {subs_created} subscriptions, {orders_created} orders"))
