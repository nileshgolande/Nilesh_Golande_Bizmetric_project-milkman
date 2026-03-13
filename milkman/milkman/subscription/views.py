from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Subscription
from .serializers import SubscriptionSerializer
from staff.auth import StaffTokenAuthentication
from customer.auth import CustomerTokenAuthentication
from datetime import datetime, date
from .utils import next_valid_delivery_date

class SubscriptionViewSet(APIView):
    authentication_classes = [StaffTokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        subscriptions = Subscription.objects.all()
        serializer = SubscriptionSerializer(subscriptions, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = SubscriptionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk, format=None):
        subscription = Subscription.objects.get(pk=pk)
        serializer = SubscriptionSerializer(subscription, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        subscription = Subscription.objects.get(pk=pk)
        subscription.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class CustomerSubscriptionCreate(APIView):
    authentication_classes = [CustomerTokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        customer = request.user if hasattr(request, "user") else None
        product_id = request.data.get("product_id")
        quantity = int(request.data.get("quantity", 1))
        frequency = request.data.get("frequency", "daily")
        if not product_id:
            return Response({"detail": "product_id required"}, status=status.HTTP_400_BAD_REQUEST)
        data = {
            "customer": customer.pk,
            "product": product_id,
            "quantity": quantity,
            "frequency": frequency,
            "is_active": True
        }
        serializer = SubscriptionSerializer(data=data)
        if serializer.is_valid():
            sub = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SubscriptionPauseView(APIView):
    authentication_classes = [CustomerTokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        sub_id = request.data.get("subscription_id")
        pause_date = request.data.get("date")
        if not sub_id or not pause_date:
            return Response({"detail": "subscription_id and date required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            sub = Subscription.objects.get(pk=sub_id)
        except Subscription.DoesNotExist:
            return Response({"detail": "Subscription not found"}, status=status.HTTP_404_NOT_FOUND)
        d = datetime.strptime(pause_date, "%Y-%m-%d").date()
        sub.pauses.get_or_create(date=d)
        if sub.end_date:
            sub.end_date = sub.end_date + timedelta(days=1)
            sub.save()
        return Response({"paused": True})


class DeliveryListView(APIView):
    authentication_classes = [StaffTokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        qdate = request.query_params.get("date")
        d = datetime.strptime(qdate, "%Y-%m-%d").date() if qdate else date.today()
        subs = Subscription.objects.filter(is_active=True)
        result = []
        for s in subs:
            if s.pauses.filter(date=d).exists():
                continue
            result.append({
                "subscription_id": s.pk,
                "customer": s.customer.name,
                "product": s.product.name,
                "quantity": s.quantity
            })
        return Response(result)


class NextDeliveryDateView(APIView):
    authentication_classes = [CustomerTokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, pk, format=None):
        try:
            sub = Subscription.objects.get(pk=pk)
        except Subscription.DoesNotExist:
            return Response({"detail": "Subscription not found"}, status=status.HTTP_404_NOT_FOUND)
        nd = next_valid_delivery_date(sub)
        return Response({"next_delivery_date": nd.isoformat()})
