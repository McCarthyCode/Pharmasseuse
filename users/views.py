from __future__ import unicode_literals

from datetime import datetime

from django.shortcuts import render
from django.contrib import messages
from django.shortcuts import render, redirect
from . import models

def index(request):
    person = models.Person.objects.get(pk=request.session['id']) if 'id' in request.session else None

    return render(request, 'users/index.html', {
        'person': person,
    })


def login(request):
    valid, response = models.Person.objects.login_register(request, 'login')

    if not valid:
        for error in response:
            messages.error(request, error)
        return redirect('gallery:index')

    person = models.Person.objects.get(pk=response)
    messages.success(request, 'Welcome back, %s!' % person.first_name)
    request.session['id'] = response
    return redirect('users:index')


def register(request):
    valid, response = models.Person.objects.login_register(request, 'register')

    if not valid:
        for error in response:
            messages.error(request, error)
        return redirect('users:index')

    messages.success(request, 'You have successfully created an account.')
    request.session['id'] = response
    return redirect('users:index')


def logout(request):
    del request.session['id']

    messages.success(request, 'You have successfully logged out.')
    return redirect('users:index')
