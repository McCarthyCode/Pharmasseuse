from datetime import datetime

from django.shortcuts import render

def index(request):
    context = {
        'year': datetime.today().year,
    }

    return render(request, 'home/index.html', context)
