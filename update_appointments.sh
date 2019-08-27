#!/bin/bash

PROJECT_DIR=/home/matt/pharmasseuse

source $PROJECT_DIR/env/bin/activate
python $PROJECT_DIR/manage.py update_appointments
deactivate

