import React, { Component } from 'react';
import MainImg from './Login/Main_img';
import Login_Compute from './Login/Login_Compute';
class Login extends Component {
    state = {}
    render() {
        return (
            <React.Fragment>
                <div className="d-flex mt-3">
                    <MainImg source="/logo192.png" />
                <Login_Compute />
                </div>
            </React.Fragment>
        );
    }
}

export default Login;