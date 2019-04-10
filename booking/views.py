import pytz

from datetime import datetime

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
