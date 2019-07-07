from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('register', views.register, name='register'),
    path('login', views.login, name='login'),
    path('logout', views.logout, name='logout'),
    path('login_redirect', views.login_redirect, name='login_redirect'),
    #path('clear_all_sessions', views.clear_all_sessions, name='clear_all_sessions'),
]
