from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('date_picker', views.date_picker, name='date_picker'),
    path('day', views.day, name='day'),
    path('prev', views.prev, name='prev'),
    path('next', views.next, name='next'),
    path('submit', views.submit, name='submit'),
    path('cancel', views.cancel, name='cancel'),
]
