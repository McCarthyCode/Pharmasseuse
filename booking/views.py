import pytz

from datetime import datetime, timedelta

from django.shortcuts import render


def index(request):
    return render(request, 'booking/index.html', {
        'date': datetime.now(pytz.UTC),
    })


def date_picker(request):
    today = datetime.now(pytz.UTC)
    year = request.GET.get('year', today.year)
    month = request.GET.get('month', today.month)

    day = datetime(int(year), int(month), 1, tzinfo=pytz.UTC)
    days = []
    while day.weekday() != 6:
        day = day - timedelta(days=1)

    for _ in range(0, 42):
        days.append({
            'year': day.year,
            'month': day.month,
            'day': day.day,
            'active': day > today and day.month == today.month,
        })

        day = day + timedelta(days=1)

    return render(request, 'booking/date_picker.html', {
        'date': today,
        'days': days,
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
