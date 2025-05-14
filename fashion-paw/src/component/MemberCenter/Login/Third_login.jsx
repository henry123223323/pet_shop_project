import React, { Component } from 'react';
class Third_Login extends Component {
    state = {
        stylelist: {
            display: 'flex',
            justifyContent: 'space-evenly',
        }
    }
    render() {
        return (
            <React.Fragment>
                <h3>第三方登入</h3>
                <div style={this.state.stylelist}>
                    <a className="btn btn-danger" href='https://744a-118-163-218-100.ngrok-free.app/auth/google/'><i className="bi bi-google"></i></a>
                    <a className="btn btn-primary" href='https://744a-118-163-218-100.ngrok-free.app/auth/facebook/callback
'><i className="bi bi-facebook"></i></a>
                </div>
            </React.Fragment>
        );
    }
}

export default Third_Login;