import pytz

from django.db import models
from django.core.exceptions import ObjectDoesNotExist
from datetime import date, datetime
from pharmasseuse.settings import TIME_ZONE


class AppointmentManager(models.Manager):
    def create_appointment(self, date_start, date_end):
        from booking.models import Appointment

        try:
            appt = Appointment.objects.get(
                date_start=date_start,
                date_end=date_end,
            )

            return (True, appt)
        except ObjectDoesNotExist:
            pass

        try:
            appt = Appointment.objects.create(
                profile=None,
                date_start=date_start,
                date_end=date_end,
            )
        except Exception as e:
            return (False, e)
        return (True, appt)


    def create_appointments(self, date, verbose=False):
        from booking.models import Appointment

        tz = pytz.timezone(TIME_ZONE)

        def toUTC(dt):
            return tz.normalize(tz.localize(dt)).astimezone(pytz.utc)

        def appointments(times):
            for pair in times:
                hour_start, minute_start = pair[0]
                hour_end, minute_end = pair[1]

                date_start = toUTC(datetime(
                    date.year,
                    date.month,
                    date.day,
                    hour_start,
                    minute_start,
                ))

                date_end = toUTC(datetime(
                    date.year,
                    date.month,
                    date.day,
                    hour_end,
                    minute_end,
                ))

                valid, response = self.create_appointment(date_start, date_end)

                if not valid:
                    raise response

                if verbose:
                    print('%s %s' % (response.date_start, response.date_end))


        def weekend():
            appointments([
                [ (8, 0),  (8, 50)], #  8am
                [ (9, 0),  (9, 50)], #  9am
                [(10, 0), (10, 50)], # 10am
                [(11, 0), (11, 50)], # 11am

                [(13, 0), (13, 50)], #  1pm
                [(14, 0), (14, 50)], #  2pm
                [(15, 0), (15, 50)], #  3pm

                [(17, 0), (17, 50)], #  5pm
                [(18, 0), (18, 50)], #  6pm
                [(19, 0), (19, 50)], #  7pm
            ])


        def weekday():
            appointments([
                [(17, 0), (17, 50)], # 5pm
                [(18, 0), (18, 50)], # 6pm
                [(19, 0), (19, 50)], # 7pm
            ])


        options = {
            0: weekday,
            1: weekday,
            2: weekday,
            3: weekday,
            4: weekday,
            5: weekend,
            6: weekend,
        }

        try:
            options[date.weekday()]()
        except Exception as e:
            return (False, e)
        return (True, Appointment.objects.filter(
            date_start__year=date.year,
            date_start__month=date.month,
            date_start__day=date.day,
        ))


    def submit(self, request):
        from users.models import Profile
        from .models import Appointment

        profile_id = request.POST.get('profile-id')
        appointment_id = request.POST.get('appointment-id')
        massage = request.POST.get('massage')

        try:
            profile = Profile.objects.get(pk=profile_id)
            appts = Appointment.objects.filter(
                profile=profile,
                date_end__gt=datetime.now(pytz.utc),
            )
        except Exception as exception:
            return (False, [
                'There was an error booking your appointment.',
                exception,
            ])

        if len(appts) == 0:
            appt = Appointment.objects.get(pk=appointment_id)

            appt.profile = profile
            appt.massage = massage if massage != '' else None

            appt.save()
        else:
            return (False, ['You may only book one appointment at a time.'])

        return (True, 'You have successfully booked your appointment.')


    def cancel_appointment(self, request):
        from .models import Appointment

        try:
            appointment_id = request.POST.get('appointment-id')

            appt = Appointment.objects.get(pk=appointment_id)

            appt.profile = None
            appt.massage = None

            appt.save()
        except Exception as exception:
            return (False, [
                'There was an error cancelling your appointment.',
                exception,
            ])

        return (True, 'You have successfully cancelled your appointment.')