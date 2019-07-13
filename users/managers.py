from __future__ import unicode_literals

import re

from django.db.models import Manager
from django.contrib.auth.models import User, UserManager
from django.core.exceptions import ObjectDoesNotExist
from users import models

EMAIL_REGEX = re.compile(
    r'^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$')

class ProfileManager(Manager):
    def login_register(self, request, action):
        errors = []

        """
        Validate user input
        """
        # checks if user is registering
        if action == 'register':
            if len(request.POST['firstName']) == 0 or \
                len(request.POST['lastName']) == 0:
                errors.append('Please enter your first and last name.')
            if len(request.POST['email']) == 0:
                errors.append('Please enter your email.')
            elif not EMAIL_REGEX.match(request.POST['email']):
                errors.append('Please enter a valid email.')
            if len(request.POST['phone']) == 0:
                errors.append('Please enter your phone number.')
            if len(request.POST['password']) < 8:
                errors.append(
                    'Please enter a password that contains at least 8 characters.')
            if request.POST['confirmPassword'] != request.POST['password']:
                errors.append('Passwords must match.')
        # checks if user is logging in
        elif action == 'login':
            if not EMAIL_REGEX.match(request.POST['email']):
                errors.append('Please enter a valid email.')

        """
        Login/Register
        """
        if not errors:
            # checks if email exists in database and
            # stores any User associated with it
            try:
                user_by_email = User.objects.get(email=request.POST['email'])
            except ObjectDoesNotExist:
                user_by_email = None
            email_exists = user_by_email != None

            # checks if user is registering
            if action == 'register':
                # checks if registering user email already exists
                if email_exists:
                    errors.append(
                        'A user account with this email already exists.')
                    return (False, errors)
                # otherwise bcrypt password and create user
                user = User.objects.create_user(
                    username=request.POST['email'],
                    email=request.POST['email'],
                    password=request.POST['password'],
                    first_name=request.POST['firstName'],
                    last_name=request.POST['lastName'],
                )
                models.Profile.objects.create(
                    user=user,
                    phone=request.POST['phone'],
                )
                return (True, user.id)
            elif action == 'login':
                # compares user password with posted password
                if email_exists:
                    correct_pw = user_by_email.check_password(
                        request.POST['password'])
                else:
                    correct_pw = False
                if not correct_pw or not email_exists:
                    errors.append(
                        'The email and password combination you entered does not exist in ' + \
                        'our database. Please register or try again.')
                    return (False, errors)
                # grabs user id to store in session in views
                if correct_pw:
                    return (True, user_by_email.id)
            else:
                errors.append('Invalid action.')

        return (False, errors)


    def edit_profile(self, request):
        errors = []

        if len(request.POST['firstName']) == 0 or \
            len(request.POST['lastName']) == 0:
            errors.append('Please enter your first and last name.')
        if len(request.POST['email']) == 0:
            errors.append('Please enter your email.')
        elif not EMAIL_REGEX.match(request.POST['email']):
            errors.append('Please enter a valid email.')
        if len(request.POST['phone']) == 0:
            errors.append('Please enter your phone number.')

        if not errors:
            profile = models.Profile.objects.get(pk=request.POST['profileId'])
            user = profile.user

            user.first_name = request.POST['firstName']
            user.last_name = request.POST['lastName']
            user.email = request.POST['email']
            profile.phone = request.POST['phone']

            user.save()
            profile.save()

            return (True, profile)

        return (False, errors)
