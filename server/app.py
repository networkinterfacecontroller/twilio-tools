import os
from flask import Flask, Blueprint, request, redirect
from flask_cors import cross_origin
from .tools.push_notifications import push_notifications

app = Flask(__name__)
app.register_blueprint(push_notifications)

@app.route('/')
def root():
    return 'Not Found', 404

@app.route('/authorize', methods=['POST'])
@cross_origin(origins=['https://tools.noodl.dev'])
def authorize():
    if request.form.get('PSK') and request.form.get('PSK') == os.environ.get('PSK'):
        return 'OK', 200
    else:
        return 'Unauthorized', 401



