import React, { Component } from 'react';
import { browserName } from 'react-device-detect';

class BrowserCheck extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        var update = {}
        switch(browserName) {
            case 'Firefox' || 'Chrome':
                update.browserDetails = {supportedText: 'NOT YET IMPLEMENTED', browserName};
                break;
            case 'Safari':
                var permissionData = window.safari.pushNotification.permission('web.dev.noodl');
                update.browserDetails = {pushService: 'apn', browserName};
                if (permissionData.permission == 'granted') {
                    update = {...update, registered: true, address: permissionData.deviceToken}
                } else if (permissionData.permission == 'denied') {
                    update = {...update, denied: true}
                }
                break;
            default:
                update.browserDetails = {browserName};
                break;
        }
        this.props.handleBrowserCheck(update);
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