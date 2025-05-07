import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import ThirdLogin from './Third_login';
import cookie from "js-cookie";
import axios from 'axios';

class Login_Compute extends Component {
    constructor(props) {
        super(props);
        this.email = React.createRef();
        this.password = React.createRef();
        this.state = {
            show: false,
            stylelist: {
                minHeight: '550px',
                textAlign: 'center',
                marginTop: '100px',
                uid:''
            }
        }
        this.logintest = this.logintest.bind(this);
    }
    logintest(event) {
        event.preventDefault();
        const email = this.email.current.value;  // 獲取 email 輸入框的值
        const password = this.password.current.value;  // 獲取 password 輸入框的值
        if (email === "" && password === "") {  // 比較兩個欄位是否為空
            alert("請輸入資料")
        } else if (email === "") {
            alert("請輸入帳號")
        } else if(password === "") {
            alert("請輸入密碼")
        }else
        {
            axios.get("http://localhost:8000/get/userinfo")
            .then(response => {
                //response.data 是陣列，遍歷每一個使用者
                const user = response.data.find(user => user.email === email);
                
                if (user) {
                    this.state.uid = user.uid
                    this.setState({})
                    console.log(this.state.uid);
                    cookie.set('user_uid', user.uid, { expires: 1 ,SameSite:'Lax'})
                    console.log('成功設置cookie',cookie.get('user_uid'));
                    
                } else {
                    alert("email或密碼錯誤")
                }
            })
            .catch(error => {
                console.error('錯誤:', error);
            });
    }
}

    render() {
        let { show } = this.state
        return (
            <React.Fragment>
                <div style={this.state.stylelist} className='col-md-6 col-12'>
                    <h1 className="text-center">登入</h1>
                    <div className="fs-2 text-center">
                        <form onSubmit={this.logintest}>
                            <label htmlFor="email">帳號(email):</label>
                            <input type="email" id="email" ref={this.email} />
                            <p></p>
                            <label htmlFor="password">密碼:</label>
                            <input type="password" id="password" ref={this.password}/>
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
