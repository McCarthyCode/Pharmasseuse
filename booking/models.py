from django.db import models
from .managers import AppointmentManager
from enum import Enum


class MassageChoice(Enum):
    NA = "None"
    SW = "Swedish"
    DT = "Deep Tissue"


class Appointment(models.Model):
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    massage = models.CharField(
        default=MassageChoice.NA,
        max_length=2,
        choices=[(tag, tag.value) for tag in MassageChoice],
    )
    date_start = models.DateTimeField()
    date_end = models.DateTimeField()
    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)
    objects = AppointmentManager()
