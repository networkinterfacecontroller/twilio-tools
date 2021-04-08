import React, { Component } from 'react';

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {loading: false}
    }

    handleClick = () => {
        this.setState({loading: true})
        this.props.handleClick();
    }

    render() {
        if (this.props.registered) {
            return (
                <div className='panel-block'>
                    <a className='button is-success' disabled>
                        Registered
                    </a>
                </div>
            );
        } else if (this.props.denied) {
            return (
                <div className='panel-block'>
                    <a className='button is-danger' disabled>
                        Permission Denied
                    </a>
                </div>
            );
        } else {
            return (
                <div className='panel-block'>
                    <a className={'button is-primary ' + ((this.state.loading) ? 'is-loading' : '')}
                       onClick={this.handleClick}
                    >
                        Register
                    </a>
                </div>
            )
        }
    }
}

export default Register;