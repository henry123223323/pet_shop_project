import React, { Component } from 'react';
import MainImg from './Login/Main_img';
import LoginCompute from './Login/Login_Compute';
class Login extends Component {
    state = {}
    render() {
        return (
            <React.Fragment>
                <div className="row">
                    <MainImg source="/cat.jpg"  className="d-none d-md-block col-md-6"/>
                    <LoginCompute />
                </div>
            </React.Fragment>
        );
    }
}

export default Login;