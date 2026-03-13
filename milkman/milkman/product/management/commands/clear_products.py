from django.core.management.base import BaseCommand
from product.models import Product


class Command(BaseCommand):
    def handle(self, *args, **options):
        n = Product.objects.update(is_active=False)
        self.stdout.write(self.style.SUCCESS(f"Deactivated {n} products"))
