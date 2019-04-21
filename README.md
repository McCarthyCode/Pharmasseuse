# The Pharmasseuse

A scheduling app for a pharmacist who doubles as a masseuse.

## Installation

Make sure `python3` and `pip3` are installed on your system and install `dateutil` and `virtualenv`.

    $ sudo apt install -y python3 python3-pip && pip3 install python-dateutil virtualenv

In the project's root directory, run the following to create a new virtual environment.

    $ virtualenv -p python3 env

Activate the newly created environment.

    $ source env/bin/activate

At any point within the virtual environment, run `deactivate` to deactivate.

    (env) $ deactivate

Go back to the virtual environment and install project dependencies.

    (env) $ pip install -r requirements.txt

## Running

Generate a secret key and export it as an environment variable.

    $ export SECRET_KEY=$(python generate_secret_key.py)

Alternatively, pipe the output to a file and edit `settings.py` to read the string from a file outside of source control.

    $ python generate_secret_key.py > secret.txt

No method is more secure than the other as an attacker can access the key both ways if they gain access to the system running the project.

Apply migrations.

    (env) $ python manage.py migrate

### Development Mode

To run in development mode, activate the virtual environment and execute the following:

    (env) python manage.py runserver localhost:8000
