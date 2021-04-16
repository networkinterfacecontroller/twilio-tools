import os
from flask import request, redirect, Blueprint
from flask_cors import cross_origin
from twilio.rest import Client

push_notifications = Blueprint('push_notifications', __name__)
oeg = os.environ.get
twilio = Client(oeg('TWILIO_API_KEY'), oeg('TWILIO_API_SECRET'), oeg('TWILIO_ACCOUNT_SID'))
notify = twilio.notify.services(oeg('TWILIO_NOTIFY_SERVICE_SID'))
apn_auth = oeg('SAFARI_APN_AUTHORIZATION_TOKEN')


@push_notifications.route('/safari/v1/log', methods=['POST'])
def log():
    print(request.get_json())
    return 'OK', 200

@push_notifications.route('/safari/v2/pushPackages/web.dev.noodl', methods=['POST'])
def package():
    return redirect('https://static.noodl.dev/safari/v2/pushPackages/web.dev.noodl')

@push_notifications.route('/safari/v1/devices/<string:token>/registrations/web.dev.noodl', methods=['POST'])
def apn_register(token):
    print(request.headers)
    if request.headers.get('Authorization') != 'ApplePushNotifications ' + apn_auth:
        return 'Unauthorized', 401
    try:
        binding = notify.bindings.create(
            identity=token,
            binding_type='apn',
            address=token,
            credential_sid=oeg('TWILIO_SAFARI_APN_CREDENTIAL_SID')
        )
    except Exception as e:
        return 'Internal Server Error', 500
    return 'OK', 200

@push_notifications.route('/safari/v1/devices/<string:token>/registrations/web.dev.noodl', methods=['DELETE'])
def delete(token):
    if request.headers.get('Authorization') != 'ApplePushNotifications ' + apn_auth:
        return 'Unauthorized', 401
    try:
        bindings = notify.bindings.list(
            tag=['apn'],
            identity=[token]
        )
        for binding in bindings:
            notify.bindings(binding.sid).delete()
    except Exception as e:
        return 'Internal Server Error', 500
    return 'OK', 200

@push_notifications.route('/firebase/<string:token>/register', methods=['POST'])
@cross_origin(origins=['https://tools.noodl.dev'])
def fcm_register(token):
    identity = token.split(':')[0]
    try:
        bindings = notify.bindings.list(
            tag=['fcm'],
            identity=[identity]
        )
        for binding in bindings:
            notify.bindings(binding.sid).delete()
        binding = notify.bindings.create(
            identity=identity,
            binding_type='fcm',
            address=token,
            credential_sid=oeg('TWILIO_FCM_CREDENTIAL_SID')
        )
    except Exception as e:
        return 'Internal Server Error', 500
    return 'OK', 200

@push_notifications.route('/tools/push/<string:identity>/send', methods=['POST'])
@cross_origin(origins=['https://tools.noodl.dev'])
def push(identity):
    try:
        bindings = notify.bindings.list(
            identity=[identity]
        )
        if bindings:
            aps = {
                    "alert": {
                        "title": "Never gonna fail to push",
                        "body": "We\'re no strangers to pu-u-ush"
                    },
                    "url-args":["success"]
                    }
            note = notify.notifications.create(
                identity=identity,
                apn={
                    'aps': aps
                },
                fcm={
                    'notification': {
                        "title": "Never gonna fail to push",
                        "body": "We\'re no strangers to pu-u-ush"
                    }
                }
            )
            print(note.sid)
    except Exception as e:
        return 'Internal Server Error', 500
    return 'OK', 200

