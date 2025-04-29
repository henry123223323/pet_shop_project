import React, { Component } from 'react';
class Receipt extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedReceiptWay: "",
        }
    }
    render() {
        const { selectedReceiptWay } = this.state
        return (<>

            <div className='px-4 py-2'>
                <input name="receiptWay" type="radio" id="memberReceipt" onChange={this.payWayChange} />
                <label className='px-2' htmlFor="memberReceipt"
                > 會員載具</label><br />

                <input name="receiptWay" type="radio" id="phoneReceipt" onChange={this.payWayChange} />
                <label className='px-2' htmlFor="phoneReceipt"> 手機載具</label><br />
                 {selectedReceiptWay === "phoneReceipt" && (
                    <div className="px-3">
                        <input name="installmentOption" type="text" id="phoneReceipt" />
                    </div>
                )}

                <input name="receiptWay" type="radio" id="companyReceipt" onChange={this.payWayChange} />
                <label className='px-2' htmlFor="companyReceipt"
                > 公司發票</label><br />
                {selectedReceiptWay === "companyReceipt" && (
                    <div className="px-3">
                        <input name="companyReceipt" type="text" id="companyReceipt" />
                    </div>
                )}



                <input name="receiptWay" type="radio" id="Cash" onChange={this.payWayChange} />
                <label className='px-2' htmlFor="Cash"
                > 捐贈發票</label>
            </div>
        </>);
    }
    payWayChange = (e) => {
        // console.log (e.target.id)
        this.setState({ selectedReceiptWay: e.target.id })
    }

}
 
export default Receipt;