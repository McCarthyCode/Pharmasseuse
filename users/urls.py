from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('logout/', views.logout, name='logout'),
    path('login-redirect/', views.login_redirect, name='login_redirect'),
    path('edit-profile/', views.edit_profile, name='edit_profile'),
    path('edit-password/', views.edit_password, name='edit_password'),
    path('edit-massage-type/', views.edit_massage_type, name='edit_massage_type'),
    #path('clear-all-sessions', views.clear_all_sessions, name='clear_all_sessions'),
]
