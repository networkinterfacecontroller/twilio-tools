import React, { Component } from 'react';
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
    }

    handleBrowserCheck = (state) => {
        console.log('update');
        this.setState(state);
    }

    handleRegisterClick = () => {
        if (this.state.browserDetails.pushService == 'apn') {
            window.safari.pushNotification.requestPermission('https://api.noodl.dev/safari', 'web.dev.noodl', {ident: 'testerson'}, this.receiveApnPermissions)
        } 
    }

    receiveApnPermissions = (obj) => {
        console.log(obj)
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
                 />
                }
            </section>
        );
    }
}

export default BrowserPush;