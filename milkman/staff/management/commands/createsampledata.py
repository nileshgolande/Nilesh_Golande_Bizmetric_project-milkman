from django.core.management.base import BaseCommand

class Command(BaseCommand):
    help = 'Create sample staff, customer, category, products and a subscription for testing'

    def handle(self, *args, **options):
        from staff.models import Staff
        from customer.models import Customer
        from category.models import Category
        from product.models import Product
        from subscription.models import Subscription

        # Create sample staff
        staff, created = Staff.objects.get_or_create(
            email='staff@milkman.test',
            defaults={
                'name': 'Sample Staff',
                'phone': '1234567890',
                'address': 'Staff Address',
                'password': 'staffpass',
            }
        )
        if created:
            self.stdout.write(self.style.SUCCESS(f'Created staff: {staff.email} / password: staffpass'))
        else:
            self.stdout.write(f'Staff already exists: {staff.email}')

        # Create sample customer
        cust, created = Customer.objects.get_or_create(
            email='customer@milkman.test',
            defaults={
                'name': 'Sample Customer',
                'phone': '0987654321',
                'address': 'Customer Address',
                'password': 'custpass',
            }
        )
        if created:
            self.stdout.write(self.style.SUCCESS(f'Created customer: {cust.email} / password: custpass'))
        else:
            self.stdout.write(f'Customer already exists: {cust.email}')

        # Create a category
        cat, _ = Category.objects.get_or_create(name='Milk')

        # Create products
        p1, _ = Product.objects.get_or_create(name='Cow Milk', defaults={'description': 'Fresh cow milk', 'price': 20.00, 'category': cat})
        p2, _ = Product.objects.get_or_create(name='Buffalo Milk', defaults={'description': 'Fresh buffalo milk', 'price': 25.00, 'category': cat})

        self.stdout.write(self.style.SUCCESS(f'Created products: {p1.name}, {p2.name}'))

        # Create sample subscription for customer to Cow Milk
        sub, created = Subscription.objects.get_or_create(customer=cust, product=p1, defaults={'quantity': 1, 'is_active': True})
        if created:
            self.stdout.write(self.style.SUCCESS(f'Created subscription for {cust.email} -> {p1.name}'))
        else:
            self.stdout.write(f'Subscription already exists for {cust.email} -> {p1.name}')

        self.stdout.write(self.style.SUCCESS('Sample data creation complete.'))
