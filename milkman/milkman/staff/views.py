from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from .models import Staff
from .serializers import StaffSerializer
from .auth import create_token, StaffTokenAuthentication


class StaffViewSet(APIView):
    authentication_classes = [StaffTokenAuthentication]
    permission_classes = [IsAuthenticated]

    # GET ALL STAFF
    def get(self, request):
        staff = Staff.objects.all()
        serializer = StaffSerializer(staff, many=True)
        return Response(serializer.data)

    # CREATE STAFF
    def post(self, request):
        serializer = StaffSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # UPDATE STAFF
    def put(self, request, pk):
        staff = get_object_or_404(Staff, pk=pk)
        serializer = StaffSerializer(staff, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # DELETE STAFF
    def delete(self, request, pk):
        staff = get_object_or_404(Staff, pk=pk)
        staff.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class LoginView(APIView):
    permission_classes = []
    authentication_classes = []

    # OPTIONAL: Allow GET so browser doesn't show 405
    def get(self, request):
        return Response({"message": "Use POST to login"})

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response(
                {"detail": "Email and password required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            staff = Staff.objects.get(email=email, password=password)
        except Staff.DoesNotExist:
            return Response(
                {"detail": "Invalid credentials"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        token = create_token(staff)

        return Response({
            "token": token,
            "staff_id": staff.pk,
            "email": staff.email
        })