from __future__ import unicode_literals

import pytz
from datetime import datetime

from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth.models import User
from users.models import Profile
from booking.models import Appointment


def index(request):
    profile = Profile.objects.get(user__pk=request.session['id']) \
        if 'id' in request.session else None

    appts = []
    next_appt = None

    if profile == None:
        appt = None
    else:
        try:
            next_appt = Appointment.objects.get(
                profile=profile,
                date_end__gt=datetime.now(pytz.utc),
            )
        except Appointment.DoesNotExist:
            next_appt = None

        appts = Appointment.objects \
            .filter(date_end__gt=datetime.now(pytz.utc)) \
            .exclude(profile__user=None)

    return render(request, 'users/index.html', {
        'profile': profile,
        'next_appt': next_appt,
        'appts': appts,
    })


def login(request):
    valid, response = Profile.objects.login_register(request, 'login')

    if not valid:
        for error in response:
            messages.error(request, error)
        return redirect('users:index')

    profile = Profile.objects.get(pk=response)
    messages.success(request, 'Welcome back, %s!' % profile.user.first_name)
    request.session['id'] = response
    return redirect('users:index')


def register(request):
    valid, response = Profile.objects.login_register(request, 'register')

    if not valid:
        for error in response:
            messages.error(request, error)
        return redirect('users:index')

    messages.success(request, 'You have successfully created an account.')
    request.session['id'] = response
    return redirect('users:index')


def logout(request):
    del request.session['id']

    messages.success(request, 'You have successfully signed out.')
    return redirect('users:index')


def login_redirect(request):
    messages.info(
        request,
        'You must sign in or register to select an appointment slot.',
    )
    return redirect('users:index')


def edit_profile(request):
    valid, response = Profile.objects.edit_profile(request)

    if valid:
        messages.success(
            request,
            'You have successfully updated your contact info.',
        )
    else:
        for error in response:
            messages.error(request, error)

    return redirect('users:index')


def edit_password(request):
    valid, response = Profile.objects.edit_password(request)

    if valid:
        messages.success(
            request,
            'You have successfully updated your password.',
        )
    else:
        for error in response:
            messages.error(request, error)

    return redirect('users:index')

def edit_massage_type(request):
    valid, response = Profile.objects.edit_massage_type(request)

    if valid:
        messages.success(request, response)
    else:
        for error in response:
            messages.error(request, error)

    return redirect('users:index')


######################
# FOR DEBUG USE ONLY #
######################

from django.http import HttpResponse
from django.contrib.sessions.models import Session

def clear_all_sessions(request):
    try:
        Session.objects.all().delete()
    except Exception as e:
        return HttpResponse(e)
    return HttpResponse('All sessions cleared.')
