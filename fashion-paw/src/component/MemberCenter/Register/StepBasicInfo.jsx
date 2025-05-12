import React, { Component } from 'react';
import axios from 'axios'
class StepBasicInfo extends Component {
    constructor(props) {
        super(props)

        this.inputusername = React.createRef();
        this.inputfirstname = React.createRef();
        this.inputlastname = React.createRef();
        this.inputaddress = React.createRef();
        this.inputphone = React.createRef();
        this.inputbirthday = React.createRef();


        this.state = {
            show: false,
            city: [],
            district: [],
            inputinfo: {

            }
        }
    }
    //一進入畫面就帶入所有縣市
    async componentDidMount() {
        let city = await axios.get('/media/member_center/city.json')
        console.log(city.data);
        let newState = { ...this.state }
        newState.city = city.data
        this.setState(newState)

    }
    //縣市改變後,順帶改變鄉鎮市區欄位
    Citychange = (event) => {
        let city = event.target.value
        //找該縣市在city陣列的哪裡
        let city_index = this.state.city.findIndex((cities, index) => {
            console.log(event.target.value);


            //去弄淺層複製，下面的抓鄉式也沒好 


            return cities.name === city
        })
        console.log(city_index);
        let newState = { ... this.state }
        newState.district = this.state.city[city_index].districts
        this.setState(newState)
        let newinputinfo = { ...this.state.inputinfo, city: event.target.value }
        this.setState({
            inputinfo: newinputinfo
        }, () => {
            console.log(this.state.inputinfo);
        })

    }

    getdistrict = (event) => {

        console.log(event.target.value);
        let newState = { ... this.state.inputinfo, district: event.target.value }
        this.setState({
            inputinfo: newState
        }, () => {
            console.log(this.state.inputinfo);
        })
    }

    timetogo = (event) => {
        event.preventDefault()

        const inputusername = this.inputusername.current.value
        const inputfirstname = this.inputfirstname.current.value
        const inputlastname = this.inputlastname.current.value
        const inputaddress = this.inputaddress.current.value
        const fullname = this.inputfirstname.current.value + this.inputlastname.current.value
        const inputphone = this.inputphone.current.value
        const inputbirthday = this.inputbirthday.current.value

        const newState = {
            ... this.state.inputinfo, firstname: inputfirstname, username: inputusername,
            userfullname: fullname, lastname: inputlastname, adress: inputaddress, phone: inputphone,
            birthday: inputbirthday
        }
        this.setState({
            inputinfo: newState
        }, () => {
            // console.log(this.state.inputinfo);
            this.props.getallinfo(this.state.inputinfo)
        })




    }










    render() {
        return (
            <>
                <fieldset className="border">
                    <legend>基本資料</legend>
                    <label>暱稱:</label> <input name="username" ref={this.inputusername} />
                    <p></p>
                    <label>姓:</label> <input name="firstname" ref={this.inputfirstname} />
                    <label>名:</label> <input name="lastname" ref={this.inputlastname} />

                    <p></p>
                    <label>地址:</label>
                    <select name="city" id="city" onChange={this.Citychange}>
                        {this.state.city.map((cities, index) => {
                            return <option key={index} value={cities.name}>{cities.name}</option>
                        })}
                    </select>
                    <select name="district" onChange={this.getdistrict}>
                        {this.state.district.map((dist, idx) => {
                            return <option key={idx} value={dist.name}>{dist.name}</option>
                        })}
                    </select>
                    <input type="text" name='address' ref={this.inputaddress} />
                    <p></p>
                    <label>電話:</label>
                    <input type="text" name='phone' ref={this.inputphone} />
                    <p></p>
                    <label >生日</label>
                    <input type="date" name="birthday" ref={this.inputbirthday} />
                    <p></p>
                    <p></p><input type="checkbox" name="" id="confirmuse" onChange={this.BeSeller} />
                    <label htmlFor="confirmuse" >是否成為賣家?</label>
                    <p></p>
                    {this.state.show && <textarea placeholder='自我介紹'></textarea>}
                    <p></p>
                    <button type="submit" className="btn btn-primary" onClick={this.timetogo}>送出</button>
                </fieldset></>
        );
    }
    BeSeller = (e) => {
        console.log(e.target.checked);
        if (e.target.checked) {
            this.setState({ show: true })
        }
        else {
            this.setState({ show: false })

        }

    }
}

export default StepBasicInfo;