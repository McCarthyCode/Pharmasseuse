from datetime import datetime

from django.shortcuts import render


def index(request):
    return render(request, 'booking/index.html')


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
