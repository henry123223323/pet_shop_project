import React, { Component } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
import Credit_Card_item from './credit_card/Credit_card_item';
class Credit_Card extends Component {
    state = {
        showModal: false,
        card: [
            {
                card_num: "5500 0000 0000 0000",
                holder: "HENRY KOO",
                expiry: "05/33"
            },
            {
                card_num: "4000 0000 0000 0001",
                holder: "HENRY KO",
                expiry: "05/33"
            },
            {
                card_num: "5500 0000 0000 0000",
                holder: "HENRY K",
                expiry: "05/43"
            }
        ]
    }
    componentDidMount() {
        //去資料庫抓資料
    }
    toggleModal = () => {
        this.setState({ showModal: !this.state.showModal });
    }

    deletecard = (index) => {//連接資料庫刪除
        const newCards = [...this.state.card];
        newCards.splice(index, 1); // 刪除指定位置的卡
        this.setState({ card: newCards });
    }
    render() {
        const { showModal, card } = this.state;

        return (
            <>
                <h2>我的信用卡</h2>
                <button className="btn btn-primary" onClick={this.toggleModal}>編輯</button>
                {card.map((card_item, index) => {                
                return <Credit_Card_item delete={() => this.deletecard(index)} key={index} card={card_item} />
            })}

                {/* 下面是編輯信用卡 */}
                {showModal && (
                    <div className="modal show fade d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <form action="">
                                <div className="modal-header">
                                    <h5 className="modal-title">新增信用卡</h5>
                                    <button type="button" className="close btn" onClick={this.toggleModal}>
                                        <span>&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <div className="form-group">
                                        <label>持卡人:</label>
                                        <input type="text" className="form-control" required/>
                                    </div>
                                   
                                    <div className="form-group">
                                        <label>信用卡卡號:</label>
                                        <input type="text" pattern='\d{4}\s\d{4}\s\d{4}\s\d{4}' className="form-control" required/>
                                    </div>
                                    <div className="form-group">
                                        <label>有效日期:</label>
                                        <input type="text" placeholder='MM/YY' pattern='(0[1-9]|1[0-2])\/\d{2}' className="form-control" required/>
                                    </div>
                                   
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={this.toggleModal}>取消</button>
                                    <input type="submit" className="btn btn-primary" value="確認"/>
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

export default Credit_Card;
