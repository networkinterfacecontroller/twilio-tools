import React from 'react';
import ky from 'ky';

function Authorize(props) {

    async function onSubmit() {
        var psk = document.getElementById('psk').value;
        const formData = new FormData();
        formData.append('PSK', psk);
        try {
            const response = await ky.post('https://api.noodl.dev/authorize', {
                mode: 'cors',
                body: formData
            });
            props.onSubmit(true);
        } catch (err) {
            console.log(err);
        }
    }
    
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
                            <a className='button is-primary' onClick={onSubmit}>Submit</a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Authorize;