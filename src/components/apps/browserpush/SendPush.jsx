import React, { Component } from 'react';
import ky from 'ky';

class SendPush extends Component {
    constructor(props) {
        super(props);
        this.state = {loading: false}
    }

    onSendPush = async () => {
        try {
            this.setState({loading: true});
            var identity;
            if (this.props.pushService == 'fcm') {
                identity = this.props.address.split(':')[0]
            } else {
                identity = this.props.address
            }
            const response = await ky.post(`https://api.noodl.dev/tools/push/${identity}/send`, {
                mode: 'cors',
            });
        } catch(err) {
            console.log(err)
        } finally {
            this.setState({loading: false})
        }
    }
    
    render() {
        return (
            <div className='panel-block'>
                <a className={'button is-primary ' + ((this.state.loading) ? 'is-loading' : '')}
                   onClick={this.onSendPush}>
                    Send Push
                </a>
            </div>
        );
    }
    
}

export default SendPush;