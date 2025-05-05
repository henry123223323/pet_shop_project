import React, { Component } from 'react';
class Change_Password extends Component {
    state = {}
    render() {
        return (
            <>
                <h3>更改密碼</h3>
                <form action="">
                    <label htmlFor="">密碼</label>
                    <input type="text" name="" id="" /><p></p>
                    <label htmlFor="">確認密碼</label>
                    <input type="text" /><p></p>
                    <input type="submit" value="確認更改" />
                </form>
            </>

        );
    }
}
export default Change_Password;

