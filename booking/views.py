import pytz

from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta
from django.http import HttpResponse
from django.shortcuts import render
from .models import Appointment
from pharmasseuse.settings import TIME_ZONE
from users.models import Profile


def index(request):
    profile = Profile.objects.get(user__pk=request.session['id']) \
        if 'id' in request.session else None

    return render(request, 'booking/index.html', {
        'date': datetime.now(pytz.timezone(TIME_ZONE)),
        'profile': profile,
    })


def date_picker(request):
    today = datetime.now(pytz.timezone(TIME_ZONE))
    year = int(request.GET.get('year', today.year))
    month = int(request.GET.get('month', today.month))

    date = first_of_month = \
        datetime(year, month, 1, tzinfo=pytz.timezone(TIME_ZONE))
    calendar = []
    while date.weekday() != 6:
        date = date - timedelta(days=1)

    for _ in range(42):
        calendar.append({
            'date': date,
            'active': date > today and date.month == first_of_month.month,
        })

        date = date + timedelta(days=1)

    return render(request, 'booking/date_picker.html', {
        'date': first_of_month,
        'calendar': calendar,
        'prev': first_of_month + relativedelta(months=-1),
        'next': first_of_month + relativedelta(months=+1),
    })


def day(request):
    times = []
    for i in range(24):
        times.append({
            'hour': '12' if i % 12 == 0 else str(i % 12),
            'minute': '00',
            'ampm': 'am' if i < 12 else 'pm',
        })

    slots = []
    appointments = Appointment.objects.filter(
        profile_id=None,
        date_start__year=int(request.GET.get('year')),
        date_start__month=int(request.GET.get('month')),
        date_start__day=int(request.GET.get('day')),
    )

    for appt in appointments:
        date_start = appt.date_start
        date_end = appt.date_end

        tz = pytz.timezone(TIME_ZONE)

        date_start = date_start.astimezone(tz)
        date_end = date_end.astimezone(tz)

        ampm_start = date_start.strftime('%p')
        ampm_end = date_end.strftime('%p')

        if ampm_start == 'AM' or ampm_start == 'PM':
            ampm_start = ampm_start.lower()

        if ampm_end == 'AM' or ampm_end == 'PM':
            ampm_end = ampm_end.lower()

        slots.append({
            'hour': date_start.hour,
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
