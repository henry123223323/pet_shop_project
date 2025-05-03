import React, { Component } from 'react';
import axios from 'axios'
class DeliverWay extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedDeliverWay: "",
            city: [],
            district: [],
            selectedZip: "",
        }
    } render() {

        const { selectedDeliverWay } = this.state
        const hasSecondItem = this.props.selectedItems?.some(item => item.condition === "second");
        return (<>
            {/* <h3>寄送方式</h3> */}
            <div className="px-3">
                <div className='d-flex align-items-center my-1'>
                    <input name="DeliverWay" type="radio" id="mailTo" onChange={this.deliverWayChange} />
                    <label className='px-2' htmlFor="mailTo"
                    > 宅配</label>
                    <br />

                    {selectedDeliverWay === "mailTo" && (
                        <>
                            <div className=' w-75'>
                            <div>
                                <label htmlFor="receiver_name">姓名：</label>
                                <input type="text" name='receiver_name' className='w-50 rounded mx-2' />
                            </div>
                            <div>
                                <label htmlFor="receiver_phone">手機：</label>
                                <input type="text" name='receiver_phone' className='w-50 rounded mx-2' />
                            </div>

                                <label htmlFor="address">地址：</label>
                                {this.state.selectedZip && (
                                    <span className='ptxt4 m-2'>
                                        {this.state.selectedZip}
                                    </span>
                                )} 
                                <select className='rounded m-2' name="city" id="city" onChange={this.citychange}>
                                    {this.state.city.map((cities, index) => {
                                        return <option key={index} value={cities.name}>{cities.name}</option>
                                    })}
                                </select>
                                <select className='rounded m-1 mb-2' name="district"
                                    onChange={this.districtChange}>
                                    {this.state.district.map((dist, idx) => {
                                        return <option key={idx} value={dist.name}>{dist.name}</option>
                                    })}
                                </select>

                                <input type="text" name='address' className='w-100 rounded mx-2 mb-3' />
                            </div>
                        </>
                    )}
                </div>

                <div
                    className='d-flex align-items-center my-1'>
                    <input name="DeliverWay" type="radio" id="shop" onChange={this.deliverWayChange} />
                    <label className='px-2' htmlFor="shop">超商取貨</label>
                    <br />
                    {selectedDeliverWay === "shop" && (
                        <>
                          <div className='w-75'>
                            <div>
                              <label htmlFor="receiver_name">姓名：</label>
                              <input type="text" name='receiver_name' className='w-50 rounded mx-2' />
                            </div>
                            <div>
                            <label htmlFor="receiver_phone">手機：</label>
                            <input type="text" name='receiver_phone' className='w-50 rounded mx-2' />
                        </div>
                        <div>
                        <label htmlFor="shop_code">超商代碼：</label>
                        <input type="text" name='shop_code' className='w-50 rounded mx-2' />
                    </div>
                    <div>
                    <label htmlFor="shop_name">門市名稱：</label>
                    <input type="text" name='shop_name' className='w-50 rounded mx-2' />
                </div>
                          </div>
                        </>
                      )}
                </div>

                {hasSecondItem && (<div className='d-flex align-items-center my-1'>
                    <input name="DeliverWay" type="radio" id="faceToFace" onChange={this.deliverWayChange} />
                    <label className='px-2' style={{ width: "100px" }} htmlFor="faceToFace"><span>面交</span></label>
                    <br />
                    {selectedDeliverWay === "faceToFace" && (
                        alert("請先與賣家確認如何面交，訂單成立後應於7天內完成訂單")
                    )}
                </div>)}
            </div>
        </>);
    }
    deliverWayChange = (e) => {
        const selected = e.target.id;
        this.setState({ selectedDeliverWay: selected }, () => {
            if (!this.props.onChange) return;

            if (selected === "mailTo") {
                this.props.onChange({
                    method: "宅配",
                    city: "台北市",
                    district: "大安區",
                    zip: "106",
                    address: "和平東路一段123號",
                    receiver_name: "王小明",
                    receiver_phone: "0912345678"
                });
            } else if (selected === "shop") {
                this.props.onChange({
                    method: "超商取貨",
                    store: "7-11 忠孝門市",
                    receiver_name: "王小明",
                    receiver_phone: "0912345678"
                });
            } else if (selected === "faceToFace") {
                this.props.onChange({
                    method: "面交",
                    meet_location: "捷運台北車站",
                    receiver_name: "王小明",
                    receiver_phone: "0912345678"
                });
            }
        });
    };
    //一進入畫面就帶入所有縣市
    async componentDidMount() {
        let city = await axios.get('/media/member_center/city.json')
        // console.log(city.data);
        let newState = { ...this.state }
        newState.city = city.data
        this.setState(newState)

    }
    //縣市改變後,順帶改變鄉鎮市區欄位
    citychange = (event) => {
        let city = event.target.value
        //找該縣市在city陣列的哪裡
        let city_index = this.state.city.findIndex((cities, index) => {
            return cities.name === city
        })
        // console.log(city_index);
        let newState = { ...this.state }
        newState.district = this.state.city[city_index].districts
        this.setState(newState)

    }
    districtChange = (event) => {
        const districtName = event.target.value;
        const currentCity = this.state.city.find(c =>
            c.districts.some(d => d.name === districtName)
        );

        if (currentCity) {
            const distObj = currentCity.districts.find(d => d.name === districtName);
            if (distObj) {
                this.setState({ selectedZip: distObj.zip });
            }
        }
    };
}

export default DeliverWay;