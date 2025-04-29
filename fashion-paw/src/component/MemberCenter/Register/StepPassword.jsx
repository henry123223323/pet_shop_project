import React, { Component } from 'react';
class StepPassword extends Component {
    state = {
        password: "",
        cpwd:""
    } 
    //密碼欄位input就更改state
    passwordinput = (event) => {
        let newState = { ...this.state }
        newState.password = event.target.value
        this.setState(newState)
    }
    cwdinput = (event) => {
        let newState = { ...this.state }
        newState.cpwd = event.target.value
        this.setState(newState)
    }
    //確認密碼是否與確認密碼相同
    PasswordComfirm = (event) => {
        event.preventDefault()
        let { password, cpwd } = this.state
        if (password === cpwd) {
            this.props.next()
        }
        else
            alert('密碼與確認密碼不符!!!')
    }
    
    render() { 
        return (
            <>
            <fieldset className=" border">
                    <legend>密碼</legend>
                    <label>密碼:</label> <input name="password" onInput={this.passwordinput}/>
                    <p></p>
                    <label>確認密碼</label> <input name="c_pwd" onInput={this.cwdinput}/>
                    <p></p>
                    <button className="btn btn-primary"
                        onClick={this.PasswordComfirm } >下一步</button>
                </fieldset>
            </>
        );
    }
}
 
export default StepPassword;