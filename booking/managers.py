import pytz
import sys

from django.db import models
from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned
from datetime import date, datetime, timedelta
from pharmasseuse.settings import TIME_ZONE

tz = pytz.timezone(TIME_ZONE)


class AppointmentManager(models.Manager):
    def index(self, request):
        from users.models import Profile
        from booking.models import Appointment

        profile = Profile.objects.get(user__pk=request.session['id']) \
            if 'id' in request.session else None

        today = datetime.now(tz).replace(hour=0, minute=0, second=0, microsecond=0)

        appts = Appointment.objects.filter(
            date_start__gte=today.astimezone(pytz.utc) + timedelta(days=1),
            profile__isnull=True,
        ).order_by('date_start')

        try:
            date_begin = appts[0].date_start
            date_begin = date_begin.astimezone(tz)
            date_begin = date_begin.replace(hour=0, minute=0, second=0, microsecond=0)
        except IndexError:
            date_begin = today

        prev_appts = Appointment.objects.filter(
            date_start__lt=date_begin.astimezone(pytz.utc),
            date_start__gte=today.astimezone(pytz.utc) + timedelta(days=1),
            profile__isnull=True,
        ).order_by('-date_start')

        next_appts = Appointment.objects \
            .filter(
                date_start__gte=date_begin.astimezone(pytz.utc) + timedelta(days=1),
                profile__isnull=True,
            ).filter(date_start__gte=today.astimezone(pytz.utc) + timedelta(days=1)) \
            .order_by('date_start')

        errors = []

        try:
            prev = prev_appts[0].date_start
        except IndexError:
            prev = date_begin - timedelta(days=1)
        except Exception as exception:
            errors.append('There was an error retrieving the previous day.')
            errors.append(exception)

        try:
            next = next_appts[0].date_start
        except IndexError:
            next = date_begin + timedelta(days=1)
        except Exception as exception:
            errors.append('There was an error retrieving the next day.')
            errors.append(exception)

        if errors:
            return (False, errors)

        return (True, {
            'date': date_begin,
            'prev': prev,
            'next': next,
            'profile': profile,
        })


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
        except Exception as exception:
            return (False, exception)
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
        except Exception as exception:
            return (False, exception)
        return (True, Appointment.objects.filter(
            date_start__year=date.year,
            date_start__month=date.month,
            date_start__day=date.day,
        ))


    def date_picker(self, request):
        from booking.models import Appointment

        today = datetime.now(tz)
        try:
            year = int(request.GET.get('year', today.year))
            month = int(request.GET.get('month', today.month))
        except Exception as exception:
            return (False, ['There was an error with the date picker.', exception])

        date = first_of_month = datetime(year, month, 1, tzinfo=tz)
        calendar = []
        while date.weekday() != 6:
            date = date - timedelta(days=1)

        for _ in range(42):
            appts = Appointment.objects.filter(
                date_start__date=date,
                profile__isnull=True,
            )

            calendar.append({
                'date': date,
                'active': \
                    date > today and \
                    date.month == first_of_month.month and \
                    len(appts) > 0,
            })

            date = date + timedelta(days=1)

        return (True, (first_of_month, calendar))


    def day(self, request):
        from booking.models import Appointment

        today = datetime.now(tz).replace(
            hour=0, minute=0, second=0, microsecond=0)
        tomorrow = today + timedelta(days=1)

        try:
            day = datetime(
                int(request.GET.get('year', tomorrow.year)),
                int(request.GET.get('month', tomorrow.month)),
                int(request.GET.get('day', tomorrow.day)),
                0, 0, 0, 0,
            )
        except Exception as exception:
            return (False, ['There was an error getting the date.', exception])

        after_change = day + timedelta(hours=3)
        day = tz.localize(day)
        after_change = tz.localize(after_change)

        spring_forward = day.tzinfo._dst.seconds < after_change.tzinfo._dst.seconds
        fall_back = day.tzinfo._dst.seconds > after_change.tzinfo._dst.seconds

        times = []
        if spring_forward:
            for i in range(2):
                times.append({
                    'hour': '12' if i % 12 == 0 else str(i % 12),
                    'minute': '00',
                    'ampm': 'a.m.' if i < 12 else 'p.m.',
                })
            for i in range(3, 24):
                times.append({
                    'hour': '12' if i % 12 == 0 else str(i % 12),
                    'minute': '00',
                    'ampm': 'a.m.' if i < 12 else 'p.m.',
                })
        elif fall_back:
            for i in range(2):
                times.append({
                    'hour': '12' if i % 12 == 0 else str(i % 12),
                    'minute': '00',
                    'ampm': 'a.m.' if i < 12 else 'p.m.',
                })
            times.append({
                'hour': 1,
                'minute': '00',
                'ampm': 'a.m.' if i < 12 else 'p.m.',
            })
            for i in range(2, 24):
                times.append({
                    'hour': '12' if i % 12 == 0 else str(i % 12),
                    'minute': '00',
                    'ampm': 'a.m.' if i < 12 else 'p.m.',
                })
        else:
            for i in range(24):
                times.append({
                    'hour': '12' if i % 12 == 0 else str(i % 12),
                    'minute': '00',
                    'ampm': 'a.m.' if i < 12 else 'p.m.',
                })

        appointments = Appointment.objects.filter(
            date_start__gte=day.astimezone(pytz.utc),
            date_start__lt=day.astimezone(pytz.utc) + timedelta(days=1),
            profile__isnull=True,
        ).filter(date_start__gte=today.astimezone(pytz.utc) + timedelta(days=1))

        slots = []
        for appt in appointments:
            date_start = appt.date_start
            date_end = appt.date_end

            date_start = date_start.astimezone(tz)
            date_end = date_end.astimezone(tz)

            ampm_start = date_start.strftime('%p')
            ampm_end = date_end.strftime('%p')

            if ampm_start == 'AM':
                ampm_start = 'a.m.'
            elif ampm_start == 'PM':
                ampm_start = 'p.m.'

            if ampm_end == 'AM':
                ampm_end = 'a.m.'
            elif ampm_end == 'PM':
                ampm_end = 'p.m.'

            hour = date_start.astimezone(tz).hour

            if spring_forward and hour >= 2:
                hour = hour - 1

            if fall_back and hour >= 2:
                hour = hour + 1

            slots.append({
                'hour': hour,
                'id': appt.id,
                'start': '%d:%02d %s' % (
                    date_start.hour % 12,
                    date_start.minute,
                    ampm_start,
                ),
                'end': '%d:%02d %s' % (
                    date_end.hour % 12,
                    date_end.minute,
                    ampm_end,
                ),
            })

        return (True, (times, slots))


    def prev(self, request):
        from booking.models import Appointment

        today = datetime.now(tz).replace(
            hour=0, minute=0, second=0, microsecond=0)

        try:
            day = datetime(
                int(request.GET.get('year')),
                int(request.GET.get('month')),
                int(request.GET.get('day')),
                0, 0, 0, 0,
            )
        except Exception as exception:
            return (False, ['There was an error getting the previous date.', exception])

        day = tz.localize(day)

        appts = Appointment.objects.filter(
                date_start__lt=day.astimezone(pytz.utc),
                date_start__gte=today.astimezone(pytz.utc) + timedelta(days=1),
                profile__isnull=True,
            ).order_by('-date_start')

        if len(appts) > 0:
            return (True, {
                'exists': True,
                'date': {
                    'year': appts[0].date_start.astimezone(tz).year,
                    'month': appts[0].date_start.astimezone(tz).month,
                    'day': appts[0].date_start.astimezone(tz).day,
                }
            })
        else:
            return (True, {'exists': False})


    def next(self, request):
        from booking.models import Appointment

        today = datetime.now(tz).replace(
            hour=0, minute=0, second=0, microsecond=0)

        try:
            day = datetime(
                int(request.GET.get('year')),
                int(request.GET.get('month')),
                int(request.GET.get('day')),
                0, 0, 0, 0,
            )
        except Exception as exception:
            return (False, ['There was an error getting the next date.', exception])

        day = tz.localize(day)

        appts = Appointment.objects \
            .filter(
                date_start__gte=day.astimezone(pytz.utc) + timedelta(days=1),
                profile__isnull=True,
            ).filter(date_start__gte=today.astimezone(pytz.utc) + timedelta(days=1)) \
            .order_by('date_start')

        if len(appts) > 0:
            return (True, {
                'exists': True,
                'date': {
                    'year': appts[0].date_start.astimezone(tz).year,
                    'month': appts[0].date_start.astimezone(tz).month,
                    'day': appts[0].date_start.astimezone(tz).day,
                }
            })
        else:
            return (True, {'exists': False})


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
        from users.models import Profile
        from .models import Appointment

        user_id = int(request.session.get('id', 0))
        client_id = int(request.POST.get('profile-id', 0))

        print(client_id)

        today = datetime.now(tz).replace(hour=0, minute=0, second=0, microsecond=0)

        try:
            profile = Profile.objects.get(pk=client_id)

            appt = Appointment.objects.get(
                profile__pk=client_id,
                date_start__gt=today.astimezone(pytz.utc) + timedelta(days=1),
            )

            appt.profile = None
            appt.massage = None

            appt.save()
        except Exception as exception:
            return (False, [
                'There was an error cancelling the appointment.',
                exception,
            ])

        name = 'your' if user_id == client_id \
            else '%s %s\'s' % (profile.user.first_name, profile.user.last_name)
        message = 'You have successfully cancelled %s appointment.' % name

        return (True, message)


    def reschedule(self, request):
        from users.models import Profile
        from booking.models import Appointment

        errors = []

        user_id = int(request.session.get('id', 0))
        client_id = int(request.session.get('client-id', 0))

        if user_id == 0:
            errors.append(
                'There was an error retrieving your profile. Please sign in.')
        if client_id == 0:
            errors.append(
                'There was an error retrieving the client\'s profile.')

        user_profile = Profile.objects.get(user__pk=user_id) \
            if 'id' in request.session else None
        client_profile = Profile.objects.get(user__pk=client_id) \
            if 'client-id' in request.session else None

        today = datetime.now(tz).replace(hour=0, minute=0, second=0, microsecond=0)

        appts = Appointment.objects.filter(
            date_start__gte=today.astimezone(pytz.utc) + timedelta(days=1),
            profile__isnull=True,
        ).order_by('date_start')

        date_begin = appts[0].date_start
        date_begin = date_begin.astimezone(tz)
        date_begin = date_begin.replace(hour=0, minute=0, second=0, microsecond=0)

        prev_appts = Appointment.objects.filter(
            date_start__lt=date_begin.astimezone(pytz.utc),
            date_start__gte=today.astimezone(pytz.utc) + timedelta(days=1),
            profile__isnull=True,
        ).order_by('-date_start')

        next_appts = Appointment.objects \
            .filter(
                date_start__gte=date_begin.astimezone(pytz.utc) + timedelta(days=1),
                profile__isnull=True,
            ).filter(date_start__gte=today.astimezone(pytz.utc) + timedelta(days=1)) \
            .order_by('date_start')

        try:
            prev = prev_appts[0].date_start
        except IndexError:
            prev = date_begin - timedelta(days=1)
        except Exception as exception:
            errors.append('There was an error retrieving the previous day.')
            errors.append(exception)

        try:
            next = next_appts[0].date_start
        except IndexError:
            next = date_begin + timedelta(days=1)
        except Exception as exception:
            errors.append('There was an error retrieving the next day.')
            errors.append(exception)

        if errors:
            return (False, errors)

        name = 'your' if user_id == client_id \
            else '%s %s\'s' % (
                client_profile.user.first_name,
                client_profile.user.last_name,
            )

        return (True, {
            'date': date_begin,
            'prev': prev,
            'next': next,
            'profile': user_profile,
            'client_profile': client_profile,
            'name': name,
        })


    def reschedule_form(self, request):
        profile_id = int(request.POST.get('profile-id', 0))

        if profile_id == 0:
            return (False, ['There was an error retrieving the client\'s profile.'])

        return (True, profile_id)


    def reschedule_submit(self, request):
        from users.models import Profile
        from booking.models import Appointment

        user_id = int(request.session.get('id', 0))
        client_id = int(request.session.get('client-id', 0))
        appt_id = int(request.POST.get('appointment-id', 0))

        profile = Profile.objects.get(user__pk=client_id) \
            if 'client-id' in request.session else None

        if profile == None:
            return (False, ['There was an error retrieving the client\'s profile.'])

        today = datetime.now(tz).replace(hour=0, minute=0, second=0, microsecond=0)

        try:
            old_appt = Appointment.objects.get(
                profile=profile,
                date_start__gt=today.astimezone(pytz.utc) + timedelta(days=1),
            )
        except Appointment.DoesNotExist:
            return (False, [
                'The specified user does not have an appointment. ' +
                'Please create one by clicking the \'Booking\' tab.',
            ])
        except MultipleObjectsReturned:
            return (False, [
                'The specified user has multiple appointments scheduled. ' +
                'Please cancel all appointments and create a new one.',
            ])

        try:
            new_appt = Appointment.objects.get(pk=appt_id)
        except Appointment.DoesNotExist:
            return (False, [
                'The specified appointment does not exist.',
            ])
        except MultipleObjectsReturned:
            return (False, [
                'The specified user has multiple appointments scheduled. ' +
                'Please cancel all appointments and create a new one.',
            ])

        new_appt.massage = old_appt.massage
        old_appt.massage = None
        old_appt.profile = None
        new_appt.profile = profile

        old_appt.save()
        new_appt.save()

        name = 'your' if user_id == client_id \
            else '%s %s\'s' % (profile.user.first_name, profile.user.last_name)
        message = 'You have successfully rescheduled %s appointment.' % name

        return (True, message)
