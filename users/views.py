from __future__ import unicode_literals

from datetime import datetime

from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth.models import User
from users.models import Profile
from booking.models import Appointment


def index(request):
    profile = Profile.objects.get(user__pk=request.session['id']) \
        if 'id' in request.session else None

    if profile == None:
        appt = None
    else:
        try:
            appt = Appointment.objects.get(profile=profile)
        except Appointment.DoesNotExist:
            appt = None

    return render(request, 'users/index.html', {
        'profile': profile,
        'appt': appt,
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
