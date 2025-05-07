import React, { Component } from 'react';
import MainImg from './Login/Main_img';
import LoginCompute from './Login/Login_Compute';
import cookie from "js-cookie";
class Login extends Component {
    
    state = {}
    render() {
        return (
            
                <div className="row paw-bg-primary">
                    <MainImg source="/media/member_center/cat.jpg"  className="d-none d-md-block col-md-6"/>
                    <LoginCompute />
                </div>
        //登入後session記憶username 使用者權限...
        );
    }
}

export default Login;