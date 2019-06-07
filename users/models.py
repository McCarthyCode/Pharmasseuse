from django.db import models
from django.contrib.auth.models import User
from users import managers

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone = models.CharField(max_length=30)
    objects = managers.ProfileManager()
