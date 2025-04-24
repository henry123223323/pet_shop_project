import React, { Component } from 'react';
class StepPassword extends Component {
    state = {  } 
    render() { 
        return (
            <>
            <fieldset class="d-none border">
                    <legend>密碼</legend>
                    <label>密碼:</label> <input name="password"/>
                    <p></p>
                    <label>確認密碼</label> <input name="c_pwd"/>
                    <p></p>
                    <button class="btn btn-primary" id="next_password"
                        onClick={() => { this.props.next(); }} >下一步</button>
                </fieldset>
            </>
        );
    }
}
 
export default StepPassword;