import React from 'react';
import Clock from './apps/clock/Clock.jsx';
import BrowserPush from './apps/browserpush/BrowserPush.jsx';

function Main(props) {
    
    function panelFrame(component) {
        return (
            <div id='Main' className='container is-centered has-text-centered'>
                <nav className='panel'>
                    <p className='panel-heading'>
                        {props.selected}
                    </p>
                    {component}
                </nav>
            </div>
        )
    }

    function appSelector() {
        switch (props.selected) {
            case 'Browser Push':
                return <BrowserPush />
            case 'Clock':
                return <Clock />;
            default:
                return;
        }
    }

    return props.selected ? panelFrame(appSelector()) : null;
}

export default Main;
