import pytz

from datetime import date, datetime, timedelta
from dateutil.relativedelta import relativedelta
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, redirect
from django.contrib import messages
from .models import Appointment
from pharmasseuse.settings import TIME_ZONE
from users.models import Profile

tz = pytz.timezone(TIME_ZONE)


def index(request):
    profile = Profile.objects.get(user__pk=request.session['id']) \
        if 'id' in request.session else None

    tomorrow = datetime.now(tz) + timedelta(days=1)
    prev = tomorrow - timedelta(days=1)
    next = tomorrow + timedelta(days=1)

    return render(request, 'booking/index.html', {
        'date': tomorrow,
        'prev': prev,
        'next': next,
        'profile': profile,
    })


def date_picker(request):
    today = datetime.now(tz)
    year = int(request.GET.get('year', today.year))
    month = int(request.GET.get('month', today.month))

    date = first_of_month = \
        datetime(year, month, 1, tzinfo=tz)
    calendar = []
    while date.weekday() != 6:
        date = date - timedelta(days=1)

    for _ in range(42):
        appts = Appointment.objects.filter(date_start__date=date)

        calendar.append({
            'date': date,
            'active': \
                date > today and \
                date.month == first_of_month.month and \
                len(appts) > 0,
        })

        date = date + timedelta(days=1)

    return render(request, 'booking/date_picker.html', {
        'date': first_of_month,
        'calendar': calendar,
        'prev': first_of_month + relativedelta(months=-1),
        'next': first_of_month + relativedelta(months=+1),
    })


def day(request):
    today = datetime.now(tz).replace(
        hour=0, minute=0, second=0, microsecond=0)
    tomorrow = today + timedelta(days=1)

    day = datetime(
        int(request.GET.get('year', tomorrow.year)),
        int(request.GET.get('month', tomorrow.month)),
        int(request.GET.get('day', tomorrow.day)),
        0, 0, 0, 0,
    )
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

    return render(request, 'booking/day.html', {
        'times': times,
        'slots': slots,
    })


def prev(request):
    today = datetime.now(tz).replace(
        hour=0, minute=0, second=0, microsecond=0)

    day = datetime(
        int(request.GET.get('year')),
        int(request.GET.get('month')),
        int(request.GET.get('day')),
        0, 0, 0, 0,
    )
    day = tz.localize(day)

    appts = Appointment.objects.filter(
            date_start__lt=day.astimezone(pytz.utc),
            date_start__gte=today.astimezone(pytz.utc) + timedelta(days=1),
        ).order_by('-date_start')

    if len(appts) > 0:
        return JsonResponse({
            'exists': True,
            'date': {
                'year': appts[0].date_start.astimezone(tz).year,
                'month': appts[0].date_start.astimezone(tz).month,
                'day': appts[0].date_start.astimezone(tz).day,
            }
        })
    else:
        return JsonResponse({
            'exists': False,
        })


def next(request):
    today = datetime.now(tz).replace(
        hour=0, minute=0, second=0, microsecond=0)

    day = datetime(
        int(request.GET.get('year')),
        int(request.GET.get('month')),
        int(request.GET.get('day')),
        0, 0, 0, 0,
    )
    day = tz.localize(day)

    appts = Appointment.objects \
        .filter(date_start__gte=day.astimezone(pytz.utc) + timedelta(days=1)) \
        .filter(date_start__gte=today.astimezone(pytz.utc) + timedelta(days=1)) \
        .order_by('date_start')

    if len(appts) > 0:
        return JsonResponse({
            'exists': True,
            'date': {
                'year': appts[0].date_start.astimezone(tz).year,
                'month': appts[0].date_start.astimezone(tz).month,
                'day': appts[0].date_start.astimezone(tz).day,
            }
        })
    else:
        return JsonResponse({
            'exists': False,
        })


def submit(request):
    try:
        profile_id = request.POST.get('profile-id')
        appointment_id = request.POST.get('appointment-id')
        massage = request.POST.get('massage')

        profile = Profile.objects.get(pk=profile_id)
        appts = Appointment.objects.filter(profile=profile)

        if len(appts) == 0:
            appt = Appointment.objects.get(pk=appointment_id)

            appt.profile = profile
            appt.massage = massage

            appt.save()
        else:
            messages.error(request, 'You may only book one appointment at a time.')

            return redirect('users:index')
    except Exception:
        messages.error(request, 'There was an error booking your appointment.')

    messages.success(request, 'You have successfully booked your appointment.')

    return redirect('users:index')

def cancel(request):
    try:
        appointment_id = request.POST.get('appointment-id')

        appt = Appointment.objects.get(pk=appointment_id)

        appt.profile = None
        appt.massage = None

        appt.save()
    except Exception:
        messages.error(request, 'There was an error cancelling your appointment.')

    messages.success(request, 'You have successfully cancelled your appointment.')

    return redirect('users:index')
