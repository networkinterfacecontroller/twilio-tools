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
def register(token):
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

@push_notifications.route('/tools/push/<string:address>/send', methods=['POST'])
@cross_origin(origins=['https://tools.noodl.dev'])
def push(address):
    try:
        bindings = notify.bindings.list(
            identity=[address]
        )
        if bindings:
            aps = {
                    "alert": {
                        "title": "Never gonna fail to push",
                        "body": "We\'re no strangers to pu-u-ush"
                    },
                    "url-args":["success"]
                    }
            notify.notifications.create(
                identity=address,
                apn={
                    'aps': aps
                }
            )
    except Exception as e:
        return 'Internal Server Error', 500
    return 'OK', 200

