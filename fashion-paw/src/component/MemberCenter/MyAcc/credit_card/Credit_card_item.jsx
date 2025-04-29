import React, { Component } from 'react';
class Credit_Card_item extends Component {
    state = {
        card: {
            id: 1,
            card_num: "5500 0000 0000 0000",
            last4: "5500",
            holder: "HENRY KO",
            expiry: "05/32"
        }
    }
    componentDidMount() {
        let newState = { ...this.state }
        newState.card = this.props.card
        newState.card.last4 = newState.card.card_num.slice(-4)
        this.setState(newState)
    }
    delete = () =>
    {
        if (window.confirm(`確定要刪除尾號${this.state.card.last4}信用卡嗎?`)) {
            
            this.props.delete()
        }

    }
    brandjudge = () => {
        let number = this.state.card.card_num
        if (number.startsWith('4')) return 'VISA';
        if (/^5[1-5]/.test(number)) return 'MasterCard';
        if (/^3[47]/.test(number)) return 'American Express';
        if (number.startsWith('35')) return 'JCB';
        return 'Unknown';

    }
    render() {
        let { card } = this.state
        return (
            <>
                <div className="card mb-3 p-3 shadow-sm">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h5>{this.brandjudge()} - **** **** **** {card.last4}</h5>
                            <p className="mb-1">持卡人：{card.holder}</p>
                            <p className="mb-1">有效期限：{card.expiry}</p>
                        </div>
                        <div>
                            <button className="btn btn-outline-danger btn-sm" onClick={this.delete}>
                                刪除
                            </button>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default Credit_Card_item
