import React, { Component } from 'react';
import ky from 'ky';

class Authorize extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.sendRequest()
    }

    sendRequest = async (options=null) => {
        try {
            const response = await ky.post('https://api.noodl.dev/authorize', {
                mode: 'cors',
                credentials: 'include',
                ...options
            });
            this.props.onSubmit(true);
        } catch (err) {
            console.log(err);
        }
    }

    onSubmit = async () => {
        var psk = document.getElementById('psk').value;
        const formData = new FormData();
        formData.append('PSK', psk);
        this.sendRequest({body:formData});
       
    }

    render () {
        return (
            <section className='hero is-fullheight'>
                <div className='hero-body'>
                    <div className='container has-text-centered'>
                        <div className='field'>
                            <div className='control'>
                                <input className='input' id='psk' type='text' placeholder='Enter your pre-shared key..'></input>
                            </div>
                        </div>
                        <div className='field'>
                            <div className='control'>
                                <a className='button is-primary' onClick={this.onSubmit}>Submit</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

export default Authorize;