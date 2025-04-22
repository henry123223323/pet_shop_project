import React, { Component } from 'react';
import Third_Login from './Third_login';

class Login_Compute extends Component {
    state = {}

    render() {
        return (
            <React.Fragment>
                <div style={{ width: '50%', marginTop: '100px', marginLeft: 'auto', marginRight: 'auto' }}>
                    <h1 className="text-center">登入</h1>
                    <div className="fs-2 text-center">
                        <form action="">
                            <label htmlFor="email">帳號(email):</label>
                            <input type="email" id="email" />
                            <p></p>
                            <label htmlFor="password">密碼:</label>
                            <input type="password" id="password" />
                            <p></p>
                            <input type="submit" className="btn btn-primary" value="登入" />
                        </form>
                    </div>
                    <a href="./myAcount.html">忘記密碼</a><br />
                    <a href="./register.html">我還沒註冊帳號</a><br /><br />
                    <hr />
                    <Third_Login />
                </div>
            </React.Fragment>
        );
    }
}

export default Login_Compute;
