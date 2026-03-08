from rest_framework import serializers
from .models import Product
from django.utils.text import slugify


class ProductSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    def get_image_url(self, obj):
        # use product name as seed to generate consistent placeholder images
        seed = slugify(obj.name) if obj.name else 'milk'
        return f"https://picsum.photos/seed/{seed}/600/400"
    class Meta:
        model = Product
        # list model fields explicitly and include the generated image_url
        fields = ('id', 'name', 'description', 'price', 'category', 'is_active', 'image_url')
