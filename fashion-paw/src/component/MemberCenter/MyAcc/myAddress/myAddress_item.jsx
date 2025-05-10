import React, { Component } from 'react';

class MyAddressItem extends Component {
    delete = () => {
        if (window.confirm(`確定要刪除「${this.props.addr.addressName}」的地址嗎？`)) {
            this.props.delete();
        }
    }

    render() {
        const { city, district, address, addressName, addressPhone } = this.props.addr;

        return (
            <div className="card mb-3 p-3 shadow-sm">
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                        <h5>{addressName} ({addressPhone})</h5>
                        <p className="mb-1">{city} {district} {address}</p>
                    </div>
                    <div>
                        <button className="btn btn-outline-primary btn-sm" onClick={this.props.edit} >
                            編輯
                        </button>
                        <button className="btn btn-outline-danger btn-sm" onClick={this.delete}>
                            刪除
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default MyAddressItem;
