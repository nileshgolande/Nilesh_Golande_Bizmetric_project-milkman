from django.core.management.base import BaseCommand, CommandError

from accounts.models import User


class Command(BaseCommand):
    help = "Create initial admin user. Fails if an admin already exists."

    def add_arguments(self, parser):
        parser.add_argument("--name", required=True)
        parser.add_argument("--email", required=True)
        parser.add_argument("--password", required=True)
        parser.add_argument("--mobile", default="")
        parser.add_argument("--address", default="")

    def handle(self, *args, **options):
        if User.objects.filter(role=User.Role.ADMIN).exists():
            raise CommandError("Admin already exists. Only one admin account is allowed.")

        user = User.objects.create_user(
            name=options["name"],
            email=options["email"],
            password=options["password"],
            mobile=options["mobile"],
            address=options["address"],
            role=User.Role.ADMIN,
            is_active=True,
        )
        self.stdout.write(self.style.SUCCESS(f"Admin created successfully: {user.email}"))
