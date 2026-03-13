from django.core.management.base import BaseCommand
from category.models import Category
from product.models import Product


class Command(BaseCommand):
    help = "Seed sample categories and products for demo/testing"

    def handle(self, *args, **options):
        dairy, _ = Category.objects.get_or_create(
            name="Dairy", defaults={"description": "Milk and Dairy", "is_active": True}
        )
        beverages, _ = Category.objects.get_or_create(
            name="Beverages", defaults={"description": "Milk-based drinks", "is_active": True}
        )

        samples = [
            {"name": "Whole Milk 1L", "description": "Rich and creamy whole milk", "price": 55.00, "category": dairy},
            {"name": "Toned Milk 1L", "description": "Healthy toned milk", "price": 50.00, "category": dairy},
            {"name": "Curd 500g", "description": "Fresh set curd", "price": 35.00, "category": dairy},
            {"name": "Paneer 200g", "description": "Soft cottage cheese", "price": 85.00, "category": dairy},
            {"name": "Chocolate Milk 250ml", "description": "Delicious choco drink", "price": 25.00, "category": beverages},
            {"name": "Badam Milk 250ml", "description": "Almond flavored milk", "price": 30.00, "category": beverages},
        ]

        created = 0
        for s in samples:
            obj, was_created = Product.objects.get_or_create(
                name=s["name"],
                defaults={
                    "description": s["description"],
                    "price": s["price"],
                    "category": s["category"],
                    "is_active": True,
                },
            )
            if was_created:
                created += 1

        self.stdout.write(self.style.SUCCESS(f"Seeded {created} products successfully"))
