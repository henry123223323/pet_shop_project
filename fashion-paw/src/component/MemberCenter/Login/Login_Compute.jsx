import React, { Component } from 'react';
import ThirdLogin from './Third_login';

class Login_Compute extends Component {
    state = {
        stylelist: {
            minHeight: '550px',
            textAlign: 'center',
            marginTop: '100px'
        }
    }

    render() {
        return (
            <React.Fragment>
                <div style={this.state.stylelist} className='col-md-6 col-12'>
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
                    <a href="/MemberCenter">忘記密碼</a><br />
                    <a href="/MemberCenter/Register">我還沒註冊帳號</a><br /><br />
                    <hr />
                    <ThirdLogin />
                </div>
            </React.Fragment>
        );
    }
}

export default Login_Compute;
