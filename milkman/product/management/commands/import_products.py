import json
from decimal import Decimal
from pathlib import Path

from django.core.management.base import BaseCommand
from django.conf import settings


class Command(BaseCommand):
    help = 'Import products from data/products.json into the Product model'

    def handle(self, *args, **options):
        data_path = Path(settings.BASE_DIR) / 'data' / 'products.json'
        if not data_path.exists():
            self.stderr.write(f'Products file not found: {data_path}')
            return

        with open(data_path, 'r', encoding='utf-8') as f:
            items = json.load(f)

        from category.models import Category
        from product.models import Product

        created = 0
        updated = 0
        for it in items:
            name = it.get('name')
            description = it.get('description', '')
            price = Decimal(str(it.get('price', '0')))
            cat_name = it.get('category', 'Uncategorized')

            category, _ = Category.objects.get_or_create(name=cat_name)

            product, was_created = Product.objects.get_or_create(
                name=name,
                defaults={
                    'description': description,
                    'price': price,
                    'category': category,
                    'is_active': True,
                }
            )
            if was_created:
                created += 1
            else:
                # update fields if necessary
                changed = False
                if product.description != description:
                    product.description = description
                    changed = True
                if product.price != price:
                    product.price = price
                    changed = True
                if product.category != category:
                    product.category = category
                    changed = True
                if changed:
                    product.save()
                    updated += 1

        self.stdout.write(self.style.SUCCESS(f'Products import complete. Created: {created}, Updated: {updated}'))
