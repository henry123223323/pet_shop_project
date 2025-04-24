import React, { Component } from 'react';

class StepEmail extends Component {
    state = {
        verify:'12345678'
    }
    EmailVerify = (event) => {
        event.preventDefault()

        //這裡驗證email,成功才執行 this.props.next()


        this.props.next()
    }
    render() {
        return (
            <fieldset className="border mt-3">
                <legend>Email</legend>
                <label >電子郵件(email)</label>
                <input name="email"  />
                <p></p>
                <label htmlFor='verify'>驗證碼</label>
                <input type="text" name="verify"/>
                <button className="btn btn-primary m-2">發送驗證碼</button>
                <p></p>
                <button className="btn btn-primary" onClick={this.EmailVerify}>
                    下一步
                </button>
            </fieldset>
        );
    }
}

export default StepEmail;
