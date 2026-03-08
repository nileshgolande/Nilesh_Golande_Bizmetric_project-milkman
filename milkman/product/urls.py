
from django.urls import path
from .views import ProductViewSet, PublicProductList

urlpatterns = [
    path('product/', ProductViewSet.as_view(), name='product-list'),
    path('product/<int:pk>/', ProductViewSet.as_view(), name='product-detail'),
    path('public/', PublicProductList.as_view(), name='product-public'),
]
