import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import ThirdLogin from './Third_login';


class Login_Compute extends Component {
    state = {
        show: false,
        stylelist: {
            minHeight: '550px',
            textAlign: 'center',
            marginTop: '100px'
        }
    }

    render() {
        let { show } = this.state
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
                            <input type="submit" className="btn paw-btn-primary" value="登入" />
                        </form>
                    </div>

                    <a href='#' onClick={() => this.setState({ show: true })}>忘記密碼</a>
                    <br />
                    <a href="/Register">我還沒註冊帳號</a><br /><br />
                    <hr />
                    <ThirdLogin />
                </div>
                {show && (
                    <div className="modal show fade d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog modal-dialog-scrollable" style={{ maxHeight: '80vh' }}>
                            <div className="modal-content">


                                <div className="modal-body" style={{ overflowY: 'auto' }}>
                                    <form action="">
                                        <label htmlFor="">電子郵件</label>
                                        <input type="text" />
                                        <p></p>
                                        <input type="submit" className='btn btn-primary' value="傳送連結" />
                                    </form>
                                </div>

                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => {
                                        this.setState({
                                            show: false
                                        })
                                    }}>取消</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </React.Fragment>
        );
    }
}

export default Login_Compute;
