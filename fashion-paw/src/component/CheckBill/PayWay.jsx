import React, { Component } from 'react';
import linepayLogo from '../ProductDetailPage/image/LINEPayLogo.png';
import jkoLogo from '../ProductDetailPage/image/jkopayLogo.webp';
import PayPalLogo from '../ProductDetailPage/image/PayPalLogo.png';
class PayWay extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedPayWay: "",
        }
    }
    render() {
        const { selectedPayWay } = this.state
        return (<>

            <div className='px-4 py-2'>
                <input name="payWay" type="radio" id="creditCard" onChange={this.payWayChange} />
                <label className='px-2' htmlFor="creditCard"
                > 信用卡：一次付清</label><br />

                <input name="payWay" type="radio" id="installment" onChange={this.payWayChange} />
                <label className='px-2' htmlFor="installment"
                > 信用卡：分期付款</label><br />
                 {selectedPayWay === "installment" && (
                    <div className="px-3">
                        <input name="installmentOption" type="radio" id="three" />
                        <label className='px-2' htmlFor="three">3期</label><br />

                        <input name="installmentOption" type="radio" id="six" />
                        <label className='px-2' htmlFor="six">6期</label><br />

                        <input name="installmentOption" type="radio" id="tweleve" />
                        <label className='px-2' htmlFor="tweleve">12期</label><br />
                    </div>
                )}

                <input name="payWay" type="radio" id="thirdPartyPayment" onChange={this.payWayChange} />
                <label className='px-2' htmlFor="thirdPartyPayment"
                > 行動支付</label><br />

                {selectedPayWay === "thirdPartyPayment" && (
                    <div className="px-3">
                        <div className='d-flex align-items-center my-1'>
                        <input name="thirdPartyOption" type="radio" id="linepay" />
                        <label className='px-2' style={{width:"100px"}} htmlFor="linepay"><img src={linepayLogo} alt="LINEPAY" /></label><br />
                        </div>

                        <div className='d-flex align-items-center my-1'>
                        <input name="thirdPartyOption" type="radio" id="streetpay" />
                        <label className='px-2' style={{width:"100px"}} htmlFor="streetpay"><img src={jkoLogo} alt="JKOPay" /></label><br />
                        </div>

                        <div className='d-flex align-items-center my-1'>
                        <input name="thirdPartyOption" type="radio" id="paypal" />
                        <label className='px-2' style={{width:"100px"}} htmlFor="paypal"><img src={PayPalLogo} alt="PayPalLogo" /></label><br />
                        </div>
                    </div>
                )}


                <input name="payWay" type="radio" id="Cash" onChange={this.payWayChange} />
                <label className='px-2' htmlFor="Cash"
                > 貨到付款</label>
            </div>
        </>);
    }
    payWayChange = (e) => {
        // console.log (e.target.id)
        this.setState({ selectedPayWay: e.target.id })
    }
}

export default PayWay;