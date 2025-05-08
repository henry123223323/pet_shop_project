import React, { Component } from 'react';

class Receipt extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedReceiptWay: '',
            phoneCarrier: '',
            companyTaxID: ''
        };
    }

    handleRadioChange = (e) => {
        const selectedReceiptWay = e.target.id;
        this.setState({ selectedReceiptWay }, this.sendToParent);
    }

    handleInputChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value }, this.sendToParent);
    }

    sendToParent = () => {
        const { selectedReceiptWay, phoneCarrier, companyTaxID } = this.state;

        let receiptStr = '';
        switch (selectedReceiptWay) {
            case 'memberReceipt':
                receiptStr = '會員載具';
                break;
            case 'phoneReceipt':
                receiptStr = `手機載具: ${phoneCarrier}`;
                break;
            case 'companyReceipt':
                receiptStr = `公司發票: ${companyTaxID}`;
                break;
            case 'DonateInvoice':
                receiptStr = '捐贈發票';
                break;
            default:
                receiptStr = '';
        }

        if (this.props.onChange) {
            this.props.onChange({ type: selectedReceiptWay, value: receiptStr });
        }
    }

    render() {
        const { selectedReceiptWay, phoneCarrier, companyTaxID } = this.state;

        return (
            <div className='px-4 py-2'>
                <input name="receiptWay" type="radio" id="memberReceipt" onChange={this.handleRadioChange} />
                <label className='px-2' htmlFor="memberReceipt">會員載具</label><br />

                <input name="receiptWay" type="radio" id="phoneReceipt" onChange={this.handleRadioChange} />
                <label className='px-2' htmlFor="phoneReceipt">手機載具</label><br />
                {selectedReceiptWay === "phoneReceipt" && (
                    <div className="px-3">
                        <input
                            name="phoneCarrier"
                            type="text"
                            value={phoneCarrier}
                            placeholder="請輸入手機條碼"
                            onChange={this.handleInputChange}
                        />
                    </div>
                )}

                <input name="receiptWay" type="radio" id="companyReceipt" onChange={this.handleRadioChange} />
                <label className='px-2' htmlFor="companyReceipt">公司發票</label><br />
                {selectedReceiptWay === "companyReceipt" && (
                    <div className="px-3">
                        <input
                            name="companyTaxID"
                            type="text"
                            value={companyTaxID}
                            placeholder="請輸入統一編號"
                            onChange={this.handleInputChange}
                        />
                    </div>
                )}

                <input name="receiptWay" type="radio" id="DonateInvoice" onChange={this.handleRadioChange} />
                <label className='px-2' htmlFor="DonateInvoice">捐贈發票</label>
            </div>
        );
    }
}

export default Receipt;