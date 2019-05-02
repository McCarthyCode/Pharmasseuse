from django.db import models
from django.contrib.auth.models import User
from . import managers

class Person(User):
    objects = managers.PersonManager()

    class Meta:
        proxy = True
auto_created = True
