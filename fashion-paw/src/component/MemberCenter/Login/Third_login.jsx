import React, { Component } from 'react';
class Third_Login extends Component {
    state = {
        stylelist: {
            display: 'flex',
            justifyContent: 'space-evenly' 
        }
    }
    render() {
        return (
            <React.Fragment>
                <h3>第三方登入</h3>
                <div style={this.state.stylelist}>
                    <a className="btn btn-danger" href='http://google.com'><i className="bi bi-google"></i></a>
                    <a className="btn btn-primary" href='http://google.com'><i className="bi bi-facebook"></i></a>
                    <a className="btn btn-dark" href='http://google.com'><i className="bi bi-twitter-x"></i></a>
                </div>
            </React.Fragment>
        );
    }
}

export default Third_Login;