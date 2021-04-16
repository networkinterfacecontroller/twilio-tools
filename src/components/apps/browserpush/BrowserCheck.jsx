import React, { Component } from 'react';
import { browserName } from 'react-device-detect';
import firebase from 'firebase/app';
import 'firebase/messaging';

class BrowserCheck extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.checkBrowser().then(update => this.props.handleBrowserCheck(update))
    }

    checkBrowser = async () => {
        var update = {};
        if (browserName == 'Safari') {
            var permissionData = window.safari.pushNotification.permission('web.dev.noodl');
                update.browserDetails = {pushService: 'apn', browserName};
                if (permissionData.permission == 'granted') {
                    update = {...update, registered: true, address: permissionData.deviceToken}
                } else if (permissionData.permission == 'denied') {
                    update = {...update, denied: true}
                }
        } else if (firebase.messaging.isSupported()) {
            update.browserDetails = {pushService: 'fcm', browserName};
            if (Notification.permission == 'granted') {
                let token = await firebase.messaging().getToken({
                    vapidKey:"BJ3_q6mfz4YHspZ3u1jRDH28KK-IPXDqZTDlYL173zOXN_lp35NrorpMBnuzbCH3suhkvgLypc0WN_J2TLVNpyE"
                });
                if (token) {
                    update = {...update, registered: true, address: token}
                }
            } else if (Notification.permission == 'denied') {
                update = {...update, denied: true}
            }
        } else {
            update.browserDetails = {supportedText: 'This browser is not supported', browserName};
        }
        return update
    }

    render() {
        return(
            <div className='panel-block'>
                It looks like you are using {browserName}! 
                {this.props.browserDetails.supportedText && ' - ' + this.props.browserDetails.supportedText}
            </div>
        );
    }  
}

export default BrowserCheck;