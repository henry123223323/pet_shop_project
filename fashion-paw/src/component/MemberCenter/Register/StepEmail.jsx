import React, { Component } from 'react';

class StepEmail extends Component {
    state = {
        
    }

    render() {
        return (
            <fieldset className="border mt-3">
                <legend>Email</legend>
                <label>電子郵件(email)</label>
                <input name="yourname" />
                <p></p>
                <label>驗證碼</label>
                <input type="text" name="yourage" />
                <button className="btn btn-primary m-2">驗證碼</button>
                <p></p>
                <button className="btn btn-primary" id="next_email" onClick={this.props.next}>
                    下一步
                </button>
            </fieldset>
        );
    }
}

export default StepEmail;
