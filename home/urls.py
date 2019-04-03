from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('tos', views.tos, name='tos'),
    path('privacy', views.privacy, name='privacy'),
]
