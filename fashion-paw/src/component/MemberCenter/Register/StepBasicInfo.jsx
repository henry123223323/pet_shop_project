import React, { Component } from 'react';
class StepBasicInfo extends Component {
    state = {  } 
    render() { 
        return (
            <>
            
            <fieldset class="d-none border">
                    <legend>基本資料</legend>
                    <label>暱稱:</label> <input name="username"/>
                    <p></p>
                    <label>姓:</label> <input name="firstname"/>
                    <label>名:</label> <input name="lastname"/>

                    <p></p>
                    <label>地址:</label>
                    <select name="" id="city">
                    </select>
                    <select name="" id="conunty">
                    </select>
                    <input type="text"/>
                    <p></p>
                    <label for="">電話:</label>
                    <input type="text"/>
                    <p></p>
                    <label for="">生日</label>
                    <input type="date" name="" id=""/>
                    <p></p>
                    <p></p><input type="checkbox" name="" id="confirmuse"/>
                    <label for="confirmuse">同意使用個人資料</label>
                    <p></p>
                    <button type="submit" class="btn btn-primary">送出</button>
                </fieldset></>
        );
    }
}
 
export default StepBasicInfo;