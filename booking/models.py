from django.db import models
from .managers import AppointmentManager


class Appointment(models.Model):
    profile = models.ForeignKey(
        'users.Profile',
        on_delete=models.PROTECT,
        unique=False,
        null=True,
    )
    massage = models.CharField(
        default=None,
        max_length=2,
        choices=[
            ('SW', 'Swedish'),
            ('DT', 'Deep Tissue'),
        ],
        null=True,
    )
    date_start = models.DateTimeField()
    date_end = models.DateTimeField()
    black_out = models.BooleanField(default=False)
    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)
    objects = AppointmentManager()
