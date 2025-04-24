import React, { Component } from 'react';
import axios from 'axios'
class StepBasicInfo extends Component {
    state = {
        city: [],
        district: []
    } 
    //一進入畫面就帶入所有縣市
    async componentDidMount() {
        let city = await axios.get('/city.json')
        console.log(city.data);
        let newState = { ...this.state }
        newState.city = city.data
        this.setState(newState)
        
    }
    //縣市改變後,順帶改變鄉鎮市區欄位
    Citychange = (event) => {
        let city = event.target.value
        //找該縣市在city陣列的哪裡
        let city_index=this.state.city.findIndex((cities, index) => {
            return cities.name===city
        })
        console.log(city_index);
        let newState = { ... this.state }
        newState.district = this.state.city[city_index].districts
        this.setState(newState)
        
    }
    render() { 
        return (
            <>            
            <fieldset className="border">
                    <legend>基本資料</legend>
                    <label>暱稱:</label> <input name="username"/>
                    <p></p>
                    <label>姓:</label> <input name="firstname"/>
                    <label>名:</label> <input name="lastname"/>

                    <p></p>
                    <label>地址:</label>
                    <select name="city" id="city" onChange={this.Citychange}>
                        {this.state.city.map((cities, index) => {
                            return <option key={index} value={cities.name}>{ cities.name}</option>
                        })}
                    </select>
                    <select name="district">
                        {this.state.district.map((dist, idx) => {
                            return <option key={idx} value={dist.name}>{dist.name}</option>
                        })}
                    </select>
                    <input type="text" name='address'/>
                    <p></p>
                    <label>電話:</label>
                    <input type="text" name='phone'/>
                    <p></p>
                    <label >生日</label>
                    <input type="date" name="birthday"/>
                    <p></p>
                    <p></p><input type="checkbox" name="" id="confirmuse"/>
                    <label htmlFor="confirmuse">同意使用個人資料</label>
                    <p></p>
                    <button type="submit" className="btn btn-primary">送出</button>
                </fieldset></>
        );
    }
}
 
export default StepBasicInfo;