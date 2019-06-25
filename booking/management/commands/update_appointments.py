import pytz
from datetime import date, datetime, timedelta

from booking.models import Appointment
from pharmasseuse.settings import TIME_ZONE

from django.core.management.base import BaseCommand, CommandError


class Command(BaseCommand):
    help = 'Adds available appointment slots for booking'

    def handle(self, *args, **options):
        today = date.today()

        # delete empty slots today or earlier
        Appointment.objects.filter(
            date_start__year__lte=today.year,
            date_start__month__lte=today.month,
            date_start__day__lte=today.day,
            profile__isnull=True,
        ).delete()

        # delete booked appointmnets before today
        yesterday = today - timedelta(days=1)
        Appointment.objects.filter(
            date_start__year__lte=yesterday.year,
            date_start__month__lte=yesterday.month,
            date_start__day__lte=yesterday.day,
            profile__isnull=False,
        ).delete()

        day = today + timedelta(days=1)
        for _ in range(7):
            valid, response = Appointment.objects.create_appointments(
                day,
                verbose=options['verbosity'] > 1,
            )

            if not valid:
                raise CommandError(response)

            day = day + timedelta(days=1)

        if options['verbosity'] > 0:
            self.stdout.write(self.style.SUCCESS('Successfully added appointment slots.'))
