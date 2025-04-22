import React, { Component } from 'react';
class Third_Login extends Component {
    state = {}
    render() {
        return (
            <React.Fragment>
                <h3>第三方登入</h3>
                <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                    <a className="btn btn-danger"><i className="bi bi-google"></i></a>
                    <a className="btn btn-primary"><i className="bi bi-facebook"></i></a>
                    <a className="btn btn-dark"><i className="bi bi-twitter-x"></i></a>
                </div>
            </React.Fragment>
        );
    }
}

export default Third_Login;