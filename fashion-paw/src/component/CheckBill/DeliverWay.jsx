import React, { Component } from 'react';
import axios from 'axios';

class DeliverWay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedDeliverWay: "",
            city: [],
            district: [],
            selectedCity: "",
            selectedDistrict: "",
            selectedZip: "",
            receiver_name: "",
            receiver_phone: "",
            address: "",
            shop_name: "",
            errors: {
                receiver_name: '',
                receiver_phone: '',
                address: '',
                shop_name: ''
            }
        };
    }

    async componentDidMount() {
        const cityRes = await axios.get('/media/member_center/city.json');
        this.setState({ city: cityRes.data });
    }

    deliverWayChange = (e) => {
        this.setState({ selectedDeliverWay: e.target.id }, this.sendDataToParent);
    }

    handleInputChange = (e) => {
        const { name, value } = e.target;
        let errorMsg = '';

        // 驗證規則
        if (name === 'receiver_name' && value.trim().length < 2) {
            errorMsg = '姓名請至少輸入2個字';
        }
        if (name === 'receiver_phone' && !/^09\d{8}$/.test(value)) {
            errorMsg = '手機格式錯誤 / 不足10碼（0987654321）';
        }
        if (name === 'address' && this.state.selectedDeliverWay === 'mailTo' && value.trim().length < 5) {
            errorMsg = '請填寫完整地址';
        }
        if (name === 'shop_name' && this.state.selectedDeliverWay === 'shop' && value.trim().length < 4) {
            errorMsg = '請輸入門市名稱';
        }

        this.setState(prevState => ({
            [name]: value,
            errors: {
                ...prevState.errors,
                [name]: errorMsg
            }
        }), this.sendDataToParent);
    }

    citychange = (event) => {
        const city = event.target.value;
        const cityIndex = this.state.city.findIndex(c => c.name === city);
        const districtList = this.state.city[cityIndex].districts;
        this.setState({
            selectedCity: city,
            district: districtList,
            selectedDistrict: districtList[0].name,
            selectedZip: districtList[0].zip
        }, this.sendDataToParent);
    }

    districtChange = (event) => {
        const districtName = event.target.value;
        const currentCity = this.state.city.find(c => c.districts.some(d => d.name === districtName));
        if (currentCity) {
            const distObj = currentCity.districts.find(d => d.name === districtName);
            if (distObj) {
                this.setState({
                    selectedDistrict: districtName,
                    selectedZip: distObj.zip
                }, this.sendDataToParent);
            }
        }
    }

    composeAddress = () => {
        const { selectedDeliverWay, selectedCity, selectedDistrict, selectedZip, address, shop_name } = this.state;
        if (selectedDeliverWay === "mailTo") {
            return `${selectedZip} ${selectedCity}${selectedDistrict}${address}`;
        } else if (selectedDeliverWay === "shop") {
            return ` ${shop_name}`;
        } else if (selectedDeliverWay === "faceToFace") {
            return "面交，請聯絡賣家約定地點";
        }
        return "";
    }

    sendDataToParent = () => {
        const { selectedDeliverWay, receiver_name, receiver_phone } = this.state;
        if (!this.props.onChange) return;

        this.props.onChange({
            method: this.getMethodText(selectedDeliverWay),
            receiver_name,
            receiver_phone,
            receiver_address: this.composeAddress()
        });
    }

    getMethodText = (way) => {
        switch (way) {
            case "mailTo": return "宅配";
            case "shop": return "超商取貨";
            case "faceToFace": return "面交";
            default: return "";
        }
    }

    render() {
        const { selectedDeliverWay, city, district } = this.state;
        const hasSecondItem = this.props.selectedItems?.some(item => item.condition === "second");

        return (
            <div className="px-3">
                {/* 宅配 */}
                <div className='d-flex align-items-center my-1'>
                    <input name="DeliverWay" type="radio" id="mailTo" onChange={this.deliverWayChange} />
                    <label className='px-2' htmlFor="mailTo">宅配</label>
                </div>
                {selectedDeliverWay === "mailTo" && (
                    <div className='w-75'>
                        <div>
                            <label>姓名：</label>
                            <input type="text" name="receiver_name" className="w-50 rounded mx-2" placeholder="請填寫真實姓名"
                                onChange={this.handleInputChange} />
                            {this.state.errors.receiver_name && (
                                <span className="text-danger small mt-1 ms-2">{this.state.errors.receiver_name}</span>
                            )}
                        </div>
                        <div>
                            <label>手機：</label>
                            <input type="text" name="receiver_phone" className="w-50 rounded mx-2"
                                placeholder="請填寫台灣手機號碼"
                                onChange={this.handleInputChange} />
                            {this.state.errors.receiver_phone && (
                                <span className="text-danger small mt-1 ms-2">{this.state.errors.receiver_phone}</span>
                            )}
                        </div>
                        <div>
                            <label>地址：</label>
                            <select className='rounded m-2' name="city" onChange={this.citychange}>
                                <option>選擇縣市</option>
                                {city.map((c, i) => <option key={i} value={c.name}>{c.name}</option>)}
                            </select>
                            <select className='rounded m-1 mb-2' name="district" onChange={this.districtChange}>
                                <option>選擇區域</option>
                                {district.map((d, i) => <option key={i} value={d.name}>{d.name}</option>)}
                            </select>
                            <input type="text" name="address" placeholder="詳細地址" className="w-100 rounded mx-2"
                                onChange={this.handleInputChange} />
                            {this.state.errors.address && (
                                <span className="text-danger small mt-1 ms-2">{this.state.errors.address}</span>
                            )}
                        </div>
                    </div>
                )}

                {/* 超商 */}
                <div className='d-flex align-items-center my-1'>
                    <input name="DeliverWay" type="radio" id="shop" onChange={this.deliverWayChange} />
                    <label className='px-2' htmlFor="shop">超商取貨</label>
                </div>
                {selectedDeliverWay === "shop" && (
                    <div className='w-75'>
                        <div>
                            <label>姓名：</label>
                            <input type="text" name="receiver_name" placeholder="請填寫真實姓名" className="w-50 rounded mx-2"
                                onChange={this.handleInputChange} />
                            {this.state.errors.receiver_name && (
                                <span className="text-danger small mt-1 ms-2">{this.state.errors.receiver_name}</span>
                            )}
                        </div>
                        <div>
                            <label>手機：</label>
                            <input type="text" name="receiver_phone" className="w-50 rounded mx-2" placeholder="請填寫台灣手機號碼"
                                onChange={this.handleInputChange} />
                            {this.state.errors.receiver_phone && (
                                <span className="text-danger small mt-1 ms-2">{this.state.errors.receiver_phone}</span>
                            )}
                        </div>
                        <div>
                            <label>選擇超商：</label>
                            <select
                                className='rounded m-2'
                                name="shop_type"
                                onChange={this.handleInputChange}
                            >
                                <option value="">請選擇</option>
                                <option value="7-11">7-11</option>
                                <option value="全家">全家</option>
                            </select>
                        </div>
                        <div>
                            <label>門市名稱：</label>
                            <input type="text" name="shop_name" placeholder="請填寫門市名稱" className="w-50 rounded mx-2"
                                onChange={this.handleInputChange} />
                            {this.state.errors.shop_name && (
                                <span className="text-danger small mt-1 ms-2">{this.state.errors.shop_name}</span>
                            )}
                        </div>
                    </div>
                )}

                {/* 面交（限有二手商品） */}
                {hasSecondItem && (
    <div className='d-flex flex-column align-items-start my-1'>
        <div className='d-flex align-items-center'>
            <input name="DeliverWay" type="radio" id="faceToFace" onChange={this.deliverWayChange} />
            <label className='px-2' htmlFor="faceToFace">面交</label>
        {this.state.selectedDeliverWay === "faceToFace" && (
            <div className="d paw-text-pink ms-4 mt-1">
                選擇面交後，請主動聯繫賣家私訊討論地點與時間。
            </div>
        )}
        </div>
    </div>
)}
            </div>
        );
    }
}

export default DeliverWay;