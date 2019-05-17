from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('date_picker', views.date_picker, name='date_picker'),
    path('day', views.day, name='day'),
]