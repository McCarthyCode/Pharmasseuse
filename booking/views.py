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
    valid, response = Appointment.objects.date_picker(request)

    if not valid:
        for error in response:
            messages.error(request, error)

        return redirect('users:index')

    first_of_month, calendar = response

    return render(request, 'booking/date_picker.html', {
        'date': first_of_month,
        'calendar': calendar,
        'prev': first_of_month + relativedelta(months=-1),
        'next': first_of_month + relativedelta(months=+1),
    })


def day(request):
    valid, response = Appointment.objects.day(request)

    if not valid:
        for error in response:
            messages.error(request, error)

        return redirect('users:index')

    times, slots = response

    return render(request, 'booking/day.html', {
        'times': times,
        'slots': slots,
    })


def prev(request):
    valid, response = Appointment.objects.prev(request)

    if not valid:
        for error in response:
            messages.error(request, error)

        return redirect('users:index')

    return JsonResponse(response)


def next(request):
    valid, response = Appointment.objects.next(request)

    if not valid:
        for error in response:
            messages.error(request, error)

        return redirect('users:index')

    return JsonResponse(response)


def submit(request):
    valid, response = Appointment.objects.submit(request)

    if not valid:
        for error in response:
            messages.error(request, error)

        return redirect('users:index')

    messages.success(request, response)

    return redirect('users:index')


def cancel(request):
    valid, response = Appointment.objects.cancel_appointment(request)

    if not valid:
        for error in response:
            messages.error(request, error)

        return redirect('users:index')

    messages.success(request, response)

    return redirect('users:index')


def reschedule(request):
    return redirect('booking:index')


def reschedule_form(request):
    return redirect('booking:index')