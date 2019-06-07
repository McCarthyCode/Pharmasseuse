from datetime import datetime

from django.shortcuts import render


def index(request):
    profile = Profile.objects.get(user__pk=request.session['id']) \
        if 'id' in request.session else None

    return render(request, 'home/index.html', {
        'name': 'The Pharmasseuse',
        'year': datetime.today().year,
        'profile': profile,
    })


def tos(request):
    profile = Profile.objects.get(user__pk=request.session['id']) \
        if 'id' in request.session else None

    return render(request, 'home/tos.html', {
        'name': 'The Pharmasseuse',
        'domain': 'pharmasseuse.com',
        'year': datetime.today().year,
        'profile': profile,
    })


def privacy(request):
    profile = Profile.objects.get(user__pk=request.session['id']) \
        if 'id' in request.session else None

    return render(request, 'home/privacy.html', {
        'name': 'The Pharmasseuse',
        'domain': 'pharmasseuse.com',
        'year': datetime.today().year,
        'profile': profile,
    })
