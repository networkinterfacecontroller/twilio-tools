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
@cross_origin(origins=['https://tools.noodl.dev'], expose_headers=['Set-Cookie'], supports_credentials=True)
def authorize():
    auth = request.form.get('PSK') or request.cookies.get('PSK')
    if auth and auth == os.environ.get('PSK'):
        if request.cookies.get('PSK'):
            cookies = {}
        else:
            cookies = {'Set-Cookie': f'PSK={request.form.get("PSK")};Domain=api.noodl.dev;Secure;Max-Age=2592000'}
        return ('OK', 200, cookies)
    else:
        return ('Unauthorized', 401)



