"""
Django settings for pharmasseuse project.

Generated by 'django-admin startproject' using Django 2.1.4.

For more information on this file, see
https://docs.djangoproject.com/en/2.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/2.1/ref/settings/
"""

import os

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/2.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
HOME = os.environ.get('HOME')
SECRET_KEY_FILE = '%s/pharmasseuse/auth/secret.txt' % HOME
with open(SECRET_KEY_FILE, 'r', encoding='utf8') as f:
    content = f.readline()
SECRET_KEY = content[:-1]

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

ALLOWED_HOSTS = [
    '165.22.14.65',
    'pharmasseuse.com',
    'www.pharmasseuse.com',
    'localhost',
]


# Application definition

INSTALLED_APPS = [
    'home',
    'users',
    'booking',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'pharmasseuse.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'pharmasseuse.wsgi.application'


# Database
# https://docs.djangoproject.com/en/2.1/ref/settings/#databases

if DEBUG:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
        }
    }
else:
    PGPASSWORD_FILE = '%s/pharmasseuse/auth/pgpass.txt' % HOME
    with open(PGPASSWORD_FILE, 'r', encoding='utf8') as f:
        content = f.readline()
    PGPASSWORD = content[:-1]

    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql_psycopg2',
            'NAME': 'pharmasseuse',
            'USER': 'pharmasseuse',
            'PASSWORD': PGPASSWORD,
            'HOST': 'localhost',
            'PORT': '',
        }
    }



# Password validation
# https://docs.djangoproject.com/en/2.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/2.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'America/Chicago'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/2.1/howto/static-files/

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'static/')

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')


# Session expiry

if not DEBUG:
    SESSION_EXPIRE_AT_BROWSER_CLOSE = False
    SESSION_COOKIE_AGE = 30 * 60


# Email settings

if DEBUG:
    EMAIL_HOST = 'localhost'
    EMAIL_PORT = 1025
else:
    EMAIL_HOST = 'smtp.mailgun.com'
    EMAIL_PORT = 587
    EMAIL_HOST_USER = 'postmaster@mg.pharmasseuse.com'
    EMAIL_HOST_PASSWORD_FILE = '%s/pharmasseuse/auth/mailgun.txt' % HOME
    with open(EMAIL_HOST_PASSWORD_FILE, 'r', encoding='utf8') as f:
        content = f.readline()
    EMAIL_HOST_PASSWORD = content[:-1]
    EMAIL_USE_TLS = True
    DEFAULT_FROM_EMAIL = 'noreply@pharmasseuse.com'
