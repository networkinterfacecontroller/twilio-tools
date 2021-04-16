import './sass/style.scss';
import React, { Component } from 'react';
import Menu from './components/Menu.jsx';
import Main from './components/Main.jsx';
import Authorize from './components/Authorize.jsx';


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menuOption: null,
            authorized: false
        }
    }

    handleMenuChange = (opt) => {
        this.setState({
            menuOption: opt
        });
    }

    handleAuthChange = (authorized) => {
        this.setState({
            authorized
        });
    }

    render() {
        if (!(this.state.authorized)) {
            return (
                <div>
                    <Authorize onSubmit={this.handleAuthChange}/>
                </div>
            )
        }
        return(
            <div className="container columns" id="App">
                <div className="column is-one-quarter">
                    <Menu 
                     selected={this.state.menuOption}
                     onMenuChange={this.handleMenuChange}
                    />
                </div>
                <div className="column is-three-quarters">
                    <Main 
                     selected={this.state.menuOption}
                    />
                </div>
            </div>
        );
    }
}

export default App;