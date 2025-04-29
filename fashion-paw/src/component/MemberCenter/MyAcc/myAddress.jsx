import React, { Component } from 'react';
import MyAddressItem from './myAddress/myAddress_item';
import axios from 'axios';

class MyAddress extends Component {
    state = {
        showModal: false,
        address: [
            {
                city: "台中市",
                district: "清水區",
                address: "中山路100號",
                addressName: "王小名",
                addressPhone: "0426222758"
            },
            {
                city: "台北市",
                district: "木柵區",
                address: "木柵路一段123號",
                addressName: "陳大名",
                addressPhone: "0223456789"
            }
        ],
        newAddress: {
            city: '',
            district: '',
            address: '',
            addressName: '',
            addressPhone: ''
        },
        editingIndex: null  // 🔥 記錄現在是編輯第幾個
    };

    toggleModal = () => {
        this.setState({
            showModal: !this.state.showModal,
            newAddress: { city: '', district: '', address: '', addressName: '', addressPhone: '' },
            editingIndex: null
        });
    };

    toggleEdit = (index) => {
        const addressToEdit = this.state.address[index];
        this.setState({
            showModal: true,
            newAddress: { ...addressToEdit },
            editingIndex: index
        });
    };

    handleInputChange = (e) => {
        const { name, value } = e.target;
        this.setState(prevState => ({
            newAddress: {
                ...prevState.newAddress,
                [name]: value
            }
        }));
    };

    handleSubmit = (e) => {
        e.preventDefault();
        const { editingIndex, address, newAddress } = this.state;

        if (editingIndex === null) {
            //  新增模式
            this.setState({
                address: [...address, newAddress],
                showModal: false,
                newAddress: { city: '', district: '', address: '', addressName: '', addressPhone: '' }
            });
        } else {
            //  編輯模式
            const updatedAddress = [...address];
            updatedAddress[editingIndex] = newAddress;
            this.setState({
                address: updatedAddress,
                showModal: false,
                newAddress: { city: '', district: '', address: '', addressName: '', addressPhone: '' },
                editingIndex: null
            });
        }
    };

    deleteaddr = (index) => {
        const newAddr = [...this.state.address];
        newAddr.splice(index, 1);
        this.setState({ address: newAddr });
    };

    render() {
        const { showModal, address, newAddress, editingIndex } = this.state;

        return (
            <>
                <h2>我的地址</h2>
                <button className="btn btn-primary" onClick={this.toggleModal}>新增</button>

                {address.map((addr_item, index) => (
                    <MyAddressItem
                        key={index}
                        addr={addr_item}
                        edit={() => this.toggleEdit(index)}
                        delete={() => this.deleteaddr(index)}
                    />
                ))}

                {showModal && (
                    <div className="modal show fade d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <form onSubmit={this.handleSubmit}>
                                    <div className="modal-header">
                                        <h5 className="modal-title">{editingIndex === null ? "新增地址" : "編輯地址"}</h5>
                                        <button type="button" className="close btn" onClick={this.toggleModal}>
                                            <span>&times;</span>
                                        </button>
                                    </div>
                                    <div className="modal-body">
                                        <div className="form-group">
                                            <label>收件人姓名:</label>
                                            <input type="text" name="addressName" className="form-control" value={newAddress.addressName} onChange={this.handleInputChange} required />
                                        </div>
                                        <div className="form-group">
                                            <label>收件人電話:</label>
                                            <input type="text" name="addressPhone" className="form-control" value={newAddress.addressPhone} onChange={this.handleInputChange} required />
                                        </div>
                                        <div className="form-group">
                                            <label>城市:</label>
                                            <input type="text" name="city" className="form-control" value={newAddress.city} onChange={this.handleInputChange} required />
                                        </div>
                                        <div className="form-group">
                                            <label>地區:</label>
                                            <input type="text" name="district" className="form-control" value={newAddress.district} onChange={this.handleInputChange} required />
                                        </div>
                                        <div className="form-group">
                                            <label>詳細地址:</label>
                                            <input type="text" name="address" className="form-control" value={newAddress.address} onChange={this.handleInputChange} required />
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" onClick={this.toggleModal}>取消</button>
                                        <input type="submit" className="btn btn-primary" value={editingIndex === null ? "確認新增" : "確認修改"} />
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </>
        );
    }
}

export default MyAddress;
