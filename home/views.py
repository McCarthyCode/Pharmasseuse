from datetime import datetime

from django.shortcuts import render


def index(request):
    return render(request, 'home/index.html', {
        'name': 'The Pharmasseuse',
        'year': datetime.today().year,
    })


def tos(request):
    return render(request, 'home/tos.html', {
        'name': 'The Pharmasseuse',
        'domain': 'pharmasseuse.com',
        'year': datetime.today().year,
    })


def privacy(request):
    return render(request, 'home/privacy.html', {
        'name': 'The Pharmasseuse',
        'domain': 'pharmasseuse.com',
        'year': datetime.today().year,
    })
