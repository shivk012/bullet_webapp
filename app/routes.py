import time
from app import app
from flask import Flask, render_template, send_from_directory


@app.route('/')
@app.route('/index')
def welcome():
    return ('Welcome to the index page')


@app.route('/time')
def get_current_time():
    return {'time': time.time()}


@app.route('/calendar')
def show_calendar():
    return render_template('calendar.html')


@app.route('/js/views/<path:filename>')
def javascript_folder(filename):
    return send_from_directory(app.config['static'],
                               filename, as_attachment=True,
                               mimetype='text/javascript'
                               )
