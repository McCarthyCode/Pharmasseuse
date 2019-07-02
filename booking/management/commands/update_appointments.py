import pytz
from datetime import date, datetime, timedelta

from booking.models import Appointment
from pharmasseuse.settings import TIME_ZONE

from django.core.management.base import BaseCommand, CommandError


class Command(BaseCommand):
    help = 'Adds available appointment slots for booking'

    def handle(self, *args, **options):
        today = datetime.now(pytz.timezone(TIME_ZONE)).replace(
            hour=0, minute=0, second=0, microsecond=0)

        # delete empty slots today or earlier
        Appointment.objects.filter(
            date_start__lt=today + timedelta(days=1),
            profile__isnull=True,
        ).delete()

        # delete booked appointmnets before today
        Appointment.objects.filter(
            date_start__lt=today,
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
