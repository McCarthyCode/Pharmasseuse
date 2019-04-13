import pytz

from datetime import datetime, timedelta

from django.shortcuts import render


def index(request):
    return render(request, 'booking/index.html', {
        'date': datetime.now(pytz.utc),
        'weeks': range(0, 6),
        'days': range(0, 7),
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


def date_picker(request):
    today = datetime.now(pytz.utc)
    month = request.GET.get('month', today.month)
    year = request.GET.get('year', today.year)

    days = []
    day = today - timedelta(days=1)
    while day.month == today.month or day.weekday() != 5:
        days.insert(0, {
            'day': day.day,
            'month': day.month,
            'year': day.year,
        })
        day = day - timedelta(days=1)
    day = today
    while len(days) < 42:
        days.append({
            'day': day.day,
            'month': day.month,
            'year': day.year,
        })
        day = day + timedelta(days=1)

    return render(request, 'booking/date_picker.html', {
        'date': datetime.now(pytz.utc),
        'days': days,
        'today': today,
    })
