import React, { Component } from 'react';
import axios from 'axios';
import cookie from 'js-cookie';

class DeliverWay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            CvsMapCallBack: " https://744a-118-163-218-100.ngrok-free.app",
            selectedDeliverWay: "",
            city: [],
            district: [],
            selectedCity: "",
            selectedDistrict: "",
            selectedZip: "",
            receiver_name: "",
            receiver_phone: "",
            address: "",
            selectedStore: null,
            savedAddresses: [],
            showAddressDropdown: false,
            saveThisAddress: false,
            cityLoaded: false,
            pendingAddressId: null,
            errors: {
                receiver_name: '',
                receiver_phone: '',
                address: '',
                shop_name: ''
            }
        };
    }

    async componentDidMount() {
        try {
            const cityRes = await axios.get('/media/member_center/city.json');
            this.setState({ city: cityRes.data, cityLoaded: true }, () => {
                // 套用預選地址（如果有）
                if (this.state.pendingAddressId) {
                    this.fillAddressFromSaved(this.state.pendingAddressId);
                }
            });
        } catch (err) {
            console.error('載入城市資料失敗', err);
        }

        // 抓 localStorage 裡選好的門市
        const selectedStore = localStorage.getItem('selectedCVS');
        if (selectedStore) {
            this.setState({
                selectedStore: JSON.parse(selectedStore),
                selectedDeliverWay: 'shop'
            }, this.sendDataToParent);
        }
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
        const {
            selectedDeliverWay,
            selectedCity,
            selectedDistrict,
            selectedZip,
            address,
            selectedStore
        } = this.state;

        if (selectedDeliverWay === "mailTo") {
            return `${selectedZip} ${selectedCity}${selectedDistrict}${address}`;
        } else if (selectedDeliverWay === "shop") {
            if (selectedStore?.storeName && selectedStore?.storeID) {
                return `${selectedStore.storeName}（代號：${selectedStore.storeID}）`;
            }
            return "⚠️ 門市資料不完整";
        } else if (selectedDeliverWay === "faceToFace") {
            return "面交，請聯絡賣家約定地點";
        }
        return "";
    };

    sendDataToParent = () => {
        const { selectedDeliverWay, receiver_name, receiver_phone } = this.state;
        if (!this.props.onChange) return;

        this.props.onChange({
            method: this.getMethodText(selectedDeliverWay),
            receiver_name,
            receiver_phone,
            receiver_address: this.composeAddress(),
            saveThisAddress: this.state.saveThisAddress,
            city: this.state.selectedCity,
            district: this.state.selectedDistrict,
            address: this.state.address
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

    loadSavedAddresses = async () => {
        const uid = cookie.get("user_uid");
        try {
            const res = await axios.get(`http://localhost:8000/get/address/${uid}`);
            this.setState({
                savedAddresses: res.data,
                showAddressDropdown: true,
                pendingAddressId: null // 不自動選擇第一筆
            });
        } catch (err) {
            console.error("❌ 載入地址失敗", err);
        }
    };

    fillAddressFromSaved = (selectedAid) => {
        const selected = this.state.savedAddresses.find(a => a.Aid === Number(selectedAid));
        if (!selected) return;

        const cityData = this.state.city.find(c => c.name === selected.city);
        const districtList = cityData ? cityData.districts : [];

        this.setState({
            selectedCity: selected.city,
            district: districtList,
            selectedDistrict: selected.district,
            selectedZip: (districtList.find(d => d.name === selected.district) || {}).zip || '',
            address: selected.address,
            receiver_name: selected.addressName,
            receiver_phone: selected.addressPhone,
            errors: {
                receiver_name: '',
                receiver_phone: '',
                address: ''
            }
        }, this.sendDataToParent);
    };

    clearAddress = () => {
        this.setState({
            receiver_name: '',
            receiver_phone: '',
            selectedCity: '',
            selectedDistrict: '',
            selectedZip: '',
            district: [],
            address: '',
            errors: {
                receiver_name: '',
                receiver_phone: '',
                address: '',
                shop_name: ''
            }
        }, this.sendDataToParent);
    };

    render() {
        const { CvsMapCallBack, selectedDeliverWay, city, district } = this.state;
        const hasSecondItem = this.props.selectedItems?.some(item => item.condition === "second");

        //網址
        const rawCallbackUrl = `${CvsMapCallBack}/CVScallback.html?PostFlag=N`;
        const encodedCallbackUrl = encodeURIComponent(rawCallbackUrl);

        const mapUrl = `https://emap.presco.com.tw/c2cemap.ashx?eshopid=870&servicetype=1&url=${encodedCallbackUrl}`;

        return (
            <div className="px-3">
                {/* 宅配 */}
                <div className='d-flex align-items-center my-1'>
                    <input name="DeliverWay" type="radio" id="mailTo" onChange={this.deliverWayChange} />
                    <label className='px-2' htmlFor="mailTo">宅配</label>
                </div>
                {selectedDeliverWay === "mailTo" && (
                    <div className='w-75'>
                        <div className="d-flex gap-2">
                            <button
                                className="btn paw-btn-outline-pri-darkbrown btn-sm my-2"
                                onClick={this.loadSavedAddresses}
                            >
                                我的地址
                            </button>
                            <button
                                className="btn paw-btn-outline-lightgreen btn-sm my-2"
                                onClick={this.clearAddress}
                            >
                                清除內容
                            </button>
                        </div>
                        {this.state.showAddressDropdown && (
                            <select
                                className="form-select my-2"
                                onChange={(e) => this.fillAddressFromSaved(e.target.value)}
                            >
                                <option value="">選擇儲存地址</option>
                                {this.state.savedAddresses.map((addr) => (
                                    <option key={addr.Aid} value={addr.Aid}>
                                        {addr.addressName}（{addr.city}{addr.district}{addr.address}）
                                    </option>
                                ))}
                            </select>
                        )}
                        <div>
                            <label>姓名：</label>
                            <input type="text" name="receiver_name" className="w-50 rounded mx-2" value={this.state.receiver_name} placeholder="請填寫真實姓名"
                                onChange={this.handleInputChange} />
                            {this.state.errors.receiver_name && (
                                <span className="text-danger small mt-1 ms-2">{this.state.errors.receiver_name}</span>
                            )}
                        </div>
                        <div>
                            <label>手機：</label>
                            <input type="text" name="receiver_phone" className="w-50 rounded mx-2" value={this.state.receiver_phone}
                                placeholder="請填寫台灣手機號碼"
                                onChange={this.handleInputChange} />
                            {this.state.errors.receiver_phone && (
                                <span className="text-danger small mt-1 ms-2">{this.state.errors.receiver_phone}</span>
                            )}
                        </div>
                        <div>
                            <label>地址：</label>
                            <select className='rounded m-2' name="city" value={this.state.selectedCity} onChange={this.citychange}>
                                <option>選擇縣市</option>
                                {city.map((c, i) => <option key={i} value={c.name}>{c.name}</option>)}
                            </select>
                            <select className='rounded m-1 mb-2' name="district" value={this.state.selectedDistrict} onChange={this.districtChange}>
                                <option>選擇區域</option>
                                {district.map((d, i) => <option key={i} value={d.name}>{d.name}</option>)}
                            </select>
                            <input type="text" name="address" value={this.state.address} placeholder="詳細地址" className="w-100 rounded mx-2"
                                onChange={this.handleInputChange} />
                            {this.state.errors.address && (
                                <span className="text-danger small mt-1 ms-2">{this.state.errors.address}</span>
                            )}
                        </div>
                        <div className="form-check my-2 ms-1">
                            <input
                                className="mx-2"
                                type="checkbox"
                                id="saveThisAddress"
                                name="saveThisAddress"
                                checked={this.state.saveThisAddress}
                                onChange={(e) =>
                                    this.setState({ saveThisAddress: e.target.checked }, this.sendDataToParent)
                                }
                            />
                            <label htmlFor="saveThisAddress">
                                儲存到我的地址
                            </label>
                        </div>
                    </div>
                )}

                {/* 超商 */}
                <div className='d-flex align-items-center my-1'>
                    <input
                        name="DeliverWay"
                        type="radio"
                        id="shop"
                        onChange={this.deliverWayChange}
                        checked={this.state.selectedDeliverWay === "shop"}
                    />
                    <label className='px-2' htmlFor="shop">7-11超商取貨</label>
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
                            <button className="btn">
                                <a
                                    href={mapUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    選擇門市
                                </a>
                            </button>

                            {/* 顯示門市資訊 */}
                            {this.state.selectedStore && (
                                <div className="mt-2 text-muted">
                                    <div>
                                        <span>門市代號：</span><span>{this.state.selectedStore.storeID}</span>
                                    </div>
                                    <div>
                                        <span>門市名稱：</span><span>{this.state.selectedStore.storeName}</span><p></p>
                                    </div>
                                </div>
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