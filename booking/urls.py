from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('date-picker/', views.date_picker, name='date_picker'),
    path('day/', views.day, name='day'),
    path('prev/', views.prev, name='prev'),
    path('next/', views.next, name='next'),
    path('submit/', views.submit, name='submit'),
    path('cancel/', views.cancel, name='cancel'),
    path('reschedule/', views.reschedule, name='reschedule'),
    path('reschedule-form/', views.reschedule_form, name='reschedule_form'),
    path('reschedule-submit/', views.reschedule_submit, name='reschedule_submit'),
    path('black-out/', views.black_out, name='black_out'),
    path('add-appointment/', views.add_appointment, name='add_appointment'),
]
