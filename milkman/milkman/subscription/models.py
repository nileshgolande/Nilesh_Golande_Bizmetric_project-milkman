from django.db import models
from customer.models import Customer
from product.models import Product

# Create your models here.
class Subscription(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name="subscriptions")
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="subscriptions")
    quantity = models.PositiveIntegerField(default=1)
    start_date = models.DateField(auto_now_add=True)
    end_date = models.DateField(null=True, blank=True)
    frequency = models.CharField(max_length=20, default="daily")
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.customer.name} -> {self.product.name}"


class SubscriptionPause(models.Model):
    subscription = models.ForeignKey(Subscription, on_delete=models.CASCADE, related_name="pauses")
    date = models.DateField()
    reason = models.CharField(max_length=255, blank=True)

    class Meta:
        unique_together = ("subscription", "date")
