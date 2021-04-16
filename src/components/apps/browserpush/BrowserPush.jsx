import React, { Component } from 'react';
import firebase from 'firebase/app';
import 'firebase/messaging';
import ky from 'ky';
import BrowserCheck from './BrowserCheck.jsx';
import Register from './Register.jsx';
import SendPush from './SendPush.jsx';

class BrowserPush extends Component {
    constructor(props) {
        super(props);
        this.state = {
            browserDetails: {
                pushService: null,
                supportedText: null,
                browserName: null
            },
            registered: false,
            address: null,
            denied: false
        };
        firebase.initializeApp({
            apiKey: "AIzaSyDHp6vMyaO-Jyu1k_7dzlsMcLVvlgkoTOI",
            authDomain: "notify-browser-demo.firebaseapp.com",
            databaseURL: "https://notify-browser-demo.firebaseio.com",
            projectId: "notify-browser-demo",
            storageBucket: "notify-browser-demo.appspot.com",
            messagingSenderId: "687446778658",
            appId: "1:687446778658:web:f13ad289cf0f76ef"
        });
        const messaging = firebase.messaging();
        messaging.onMessage((payload) => {
            const {title, ...options} = payload.notification;
            navigator.serviceWorker.getRegistration('./firebase-cloud-messaging-push-scope').then(registration => {
                registration.showNotification(title, options);
            });
          });
    }


    handleBrowserCheck = (state) => {
        this.setState(state);
    }

    handleRegisterClick = async () => {
        if (this.state.browserDetails.pushService == 'apn') {
            window.safari.pushNotification.requestPermission('https://api.noodl.dev/safari', 'web.dev.noodl', {ident: 'testerson'}, this.receivePermissions)
        } else {
            await firebase.messaging().deleteToken();
            firebase.messaging().getToken({
                vapidKey: "BJ3_q6mfz4YHspZ3u1jRDH28KK-IPXDqZTDlYL173zOXN_lp35NrorpMBnuzbCH3suhkvgLypc0WN_J2TLVNpyE"
            }).then(async (deviceToken) => {
                try {
                    await ky.post(`https://api.noodl.dev/firebase/${deviceToken}/register`, {
                        mode: 'cors',
                    });
                    this.receivePermissions({permission: 'granted', deviceToken});
                } catch (err) {
                    console.log(err);
                }
            }).catch(err => {
                console.log(err);
                this.receivePermissions({permission: 'denied'});
            })
        }
    }

    receivePermissions = (obj) => {
        if (obj.permission == 'denied') {
            this.setState({denied: true})
        } else if (obj.permission == 'granted') {
            this.setState({address: obj.deviceToken, registered: true})
        }
    }

    render() {
        return (
            <section>
                <BrowserCheck 
                    browserDetails={this.state.browserDetails}
                    handleBrowserCheck={this.handleBrowserCheck}
                />
                {this.state.browserDetails.pushService &&
                 <Register 
                    registered={this.state.registered}
                    denied={this.state.denied}
                    handleClick={this.handleRegisterClick}
                 />
                }
                {this.state.registered && this.state.address &&
                 <SendPush 
                    address={this.state.address}
                    pushService={this.state.browserDetails.pushService}
                 />
                }
            </section>
        );
    }
}

export default BrowserPush;