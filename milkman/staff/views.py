from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated


# Create your views here.
from .models import Staff
from .serializers import StaffSerializer
from customer.serializers import CustomerSerializer
from .auth import create_auth_token, StaffTokenAuthentication
from customer.models import Customer


class StaffViewSet(APIView):
    authentication_classes = [StaffTokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        staff = Staff.objects.all()
        serializer = StaffSerializer(staff, many=True)
        print(serializer.data)
        return Response(serializer.data)

    def post(self, request, format=None):
        if Staff.objects.exists():
            return Response(
                {"detail": "Admin already exists. Only one admin account is allowed."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        data = request.data
        print("line 23", data)
        serializer = StaffSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    def put(self, request, pk, format=None):
        staff = Staff.objects.get(pk=pk)
        serializer = StaffSerializer(staff, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        staff = Staff.objects.get(pk=pk)
        staff.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class LoginView(APIView):
    permission_classes = []
    authentication_classes = []

    def post(self, request, format=None):
        email = request.data.get("email")
        password = request.data.get("password")
        if not email or not password:
            return Response({"detail": "Email and password required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            staff = Staff.objects.get(email=email, password=password)
        except Staff.DoesNotExist:
            return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
        token = create_auth_token(staff, role='STAFF')
        return Response({"token": token, "staff_id": staff.pk, "email": staff.email, "role": "STAFF"})


class UnifiedLoginView(APIView):
    """Unified login endpoint that checks staff then customer and returns a signed token with role."""
    permission_classes = []
    authentication_classes = []

    def post(self, request, format=None):
        email = request.data.get("email")
        password = request.data.get("password")
        if not email or not password:
            return Response({"detail": "Email and password required"}, status=status.HTTP_400_BAD_REQUEST)

        # Try staff first
        try:
            staff = Staff.objects.get(email=email, password=password)
            token = create_auth_token(staff, role='STAFF')
            return Response({"token": token, "id": staff.pk, "email": staff.email, "role": "STAFF"})
        except Staff.DoesNotExist:
            pass

        # Try customer
        try:
            cust = Customer.objects.get(email=email, password=password)
            token = create_auth_token(cust, role='CUSTOMER')
            return Response({"token": token, "id": cust.pk, "email": cust.email, "role": "CUSTOMER"})
        except Customer.DoesNotExist:
            pass

        return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)


class AdminRegistrationView(APIView):
    permission_classes = []
    authentication_classes = []

    def post(self, request, format=None):
        if Staff.objects.exists():
            return Response(
                {"detail": "Admin already exists. Only one admin account is allowed."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = StaffSerializer(data=request.data)
        if serializer.is_valid():
            admin_user = serializer.save()
            return Response(
                {
                    "id": admin_user.pk,
                    "name": admin_user.name,
                    "email": admin_user.email,
                    "role": "STAFF",
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CustomerRegistrationView(APIView):
    permission_classes = []
    authentication_classes = []

    def post(self, request, format=None):
        serializer = CustomerSerializer(data=request.data)
        if serializer.is_valid():
            customer = serializer.save()
            return Response(
                {
                    "id": customer.pk,
                    "name": customer.name,
                    "email": customer.email,
                    "role": "CUSTOMER",
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
