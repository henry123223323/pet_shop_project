import React, { Component } from 'react';
class DeliverWay extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedDeliverWay: "",
        }
    }    render() {
        const {selectedDeliverWay} = this.state
        return (<>
            {/* <h3>寄送方式</h3> */}
            <div className="px-3">
                <div className='d-flex align-items-center my-1'>
                <input name="DeliverWay" type="radio" id="mailTo" onChange={this.deliverWayChange} />
                <label className='px-2' htmlFor="mailTo"
                > 宅配</label>
                <br />

                 {selectedDeliverWay === "mailTo" && (
                    <div className="px-3">
                    <label className='px-2' htmlFor="city">縣市</label>
                        <input name="mailTo" type="text" id="city" />
                        <br />

                        <label className='px-2' htmlFor="district">行政區</label>
                        <input name="mailTo" type="text" id="district" />
                        <br />

                        <label className='px-2' htmlFor="address">地址</label>
                        <input name="mailTo" type="text" id="address" />
                        <br />
                    </div>
                )}
                </div>

                <div 
                className='d-flex align-items-center my-1'>
                    <input name="DeliverWay" type="radio" id="shop" onChange={this.deliverWayChange}/>
                    <label className='px-2' htmlFor="shop">超商取貨</label>
                    <br />
                </div>

                <div className='d-flex align-items-center my-1'>
                    <input name="DeliverWay" type="radio" id="faceToFace" onChange={this.deliverWayChange} />
                    <label className='px-2' style={{ width: "100px" }} htmlFor="faceToFace"><span>面交</span></label>
                    <br />
                    {selectedDeliverWay === "faceToFace" && (
                        alert("請先與賣家確認如何面交，訂單成立後應於7天內完成訂單")
                    )}
                </div>
            </div>
        </>);
    }
    deliverWayChange = (e) => {
        console.log (e.target.id)
        this.setState({ selectedDeliverWay: e.target.id })
    }
}

export default DeliverWay;