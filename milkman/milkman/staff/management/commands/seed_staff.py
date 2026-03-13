from django.core.management.base import BaseCommand
from staff.models import Staff


class Command(BaseCommand):
    help = "Create a default staff account for admin login"

    def handle(self, *args, **options):
        email = "admin@example.com"
        defaults = {
            "name": "Admin",
            "phone": "9999999999",
            "address": "HQ",
            "password": "admin123",
            "is_active": True,
            "is_staff": True,
        }
        staff, created = Staff.objects.get_or_create(email=email, defaults=defaults)
        if created:
            self.stdout.write(self.style.SUCCESS("Created default staff: admin@example.com / admin123"))
        else:
            self.stdout.write(self.style.WARNING("Default staff already exists"))
