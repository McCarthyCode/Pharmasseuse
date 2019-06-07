import pytz

from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta

from django.shortcuts import render
from users.models import Profile


def index(request):
    profile = Profile.objects.get(user__pk=request.session['id']) \
        if 'id' in request.session else None

    return render(request, 'booking/index.html', {
        'date': datetime.now(pytz.timezone('US/Central')),
        'profile': profile,
    })


def date_picker(request):
    today = datetime.now(pytz.timezone('US/Central'))
    year = int(request.GET.get('year', today.year))
    month = int(request.GET.get('month', today.month))

    date = first_of_month = \
        datetime(year, month, 1, tzinfo=pytz.timezone('US/Central'))
    calendar = []
    while date.weekday() != 6:
        date = date - timedelta(days=1)

    for _ in range(0, 42):
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
    for i in range(0, 24):
        times.append({
            'hour': '12' if i % 12 == 0 else str(i % 12),
            'minute': '00',
            'ampm': 'a.m.' if i < 12 else 'p.m.',
        })
    
    return render(request, 'booking/day.html', {
        'times': times,
    })
