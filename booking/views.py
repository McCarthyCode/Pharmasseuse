import pytz

from django.http import (
    HttpResponse,
    JsonResponse,
    HttpResponseBadRequest,
    HttpResponseServerError,
)
from django.shortcuts import render, redirect
from django.contrib import messages
from .models import Appointment
from pharmasseuse.settings import TIME_ZONE

tz = pytz.timezone(TIME_ZONE)


def index(request):
    if request.method != 'GET':
        return HttpResponseBadRequest()

    valid, response = Appointment.objects.index(request)

    if not valid:
        return HttpResponseBadRequest()

    return render(request, 'booking/index.html', response)


def date_picker(request):
    if request.method != 'GET':
        return HttpResponseBadRequest()

    response = Appointment.objects.date_picker(request)

    return render(request, 'booking/date_picker.html', response)


def day(request):
    if request.method != 'GET':
        return HttpResponseBadRequest()

    valid, response = Appointment.objects.day(request)

    if not valid:
        return HttpResponseBadRequest()

    return render(request, 'booking/day.html', response)


def prev(request):
    if request.method != 'GET':
        return HttpResponseBadRequest()

    valid, response = Appointment.objects.prev(request)

    if not valid:
        return HttpResponseBadRequest()

    return JsonResponse(response)


def next(request):
    if request.method != 'GET':
        return HttpResponseBadRequest()

    valid, response = Appointment.objects.next(request)

    if not valid:
        return HttpResponseBadRequest()

    return JsonResponse(response)


def day_admin(request):
    if request.method != 'POST':
        return HttpResponseBadRequest()

    valid, response = Appointment.objects.day(request, True)

    if not valid:
        return HttpResponseBadRequest()

    times, slots = response

    return render(request, 'booking/day.html', response)


def prev_admin(request):
    if request.method != 'POST':
        return HttpResponseBadRequest()

    valid, response = Appointment.objects.prev(request, True)

    if not valid:
        return HttpResponseBadRequest()

    return JsonResponse(response)


def next_admin(request):
    if request.method != 'POST':
        return HttpResponseBadRequest()

    valid, response = Appointment.objects.next(request, True)

    if not valid:
        return HttpResponseBadRequest()

    return JsonResponse(response)


def submit(request):
    if request.method != 'POST':
        return HttpResponseBadRequest()

    valid, response = Appointment.objects.submit(request)

    if not valid:
        for error in response:
            messages.error(request, error)

        return redirect('users:index')

    messages.success(request, response)

    return redirect('users:index')


def cancel(request):
    if request.method != 'POST':
        return HttpResponseBadRequest()

    valid, response = Appointment.objects.cancel_appointment(request)

    if not valid:
        for error in response:
            messages.error(request, error)

        return redirect('users:index')

    messages.success(request, response)

    return redirect('users:index')


def reschedule(request):
    if request.method != 'GET':
        return HttpResponseBadRequest()

    valid, response = Appointment.objects.reschedule(request)

    if not valid:
        for error in response:
            messages.error(request, error)

        return redirect('users:index')

    return render(request, 'booking/reschedule.html', response)


def reschedule_form(request):
    if request.method != 'POST':
        return HttpResponseBadRequest()

    valid, response = Appointment.objects.reschedule_form(request)

    if not valid:
        for error in response:
            messages.error(request, error)

        return redirect('users:index')

    request.session['client-id'] = response

    return redirect('booking:reschedule')


def reschedule_submit(request):
    if request.method != 'POST':
        return HttpResponseBadRequest()

    valid, response = Appointment.objects.reschedule_submit(request)

    if not valid:
        for error in response:
            messages.error(request, error)

        return HttpResponseServerError()

    messages.success(request, response)

    del request.session['client-id']

    return HttpResponse(status=200)


def black_out_appointment(request):
    if request.method != 'POST':
        return HttpResponseBadRequest()

    valid = Appointment.objects.black_out_appointment(request)

    if not valid:
        return HttpResponseBadRequest()

    return HttpResponse(status=200)


def black_out_date(request):
    if request.method != 'POST':
        return HttpResponseBadRequest()

    valid = Appointment.objects.black_out_date(request)

    if not valid:
        return HttpResponseBadRequest()

    return HttpResponse(status=200)


def add_appointment(request):
    if request.method != 'POST':
        return HttpResponseBadRequest()

    valid, response = Appointment.objects.add_appointment(request)

    if not valid:
        for error in response:
            messages.error(request, error)

        return redirect('users:index')

    return render(request, 'booking/index.html', response)

