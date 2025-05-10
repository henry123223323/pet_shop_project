import React, { Component } from 'react';

class FavoriteCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false
        };
    }

    handleShow = () => {
        this.setState({ show: true });
    }

    handleClose = () => {
        this.setState({ show: false });
    }

    handleConfirmRemove = () => {
        this.setState({ show: false });
        this.props.onRemove();
    }

    render() {
        const { img, pd_name, price } = this.props;
        const { show } = this.state;

        return (
            <>
                <div className="col-12 col-sm-6 col-md-4 col-lg-3 card shadow-sm" style={{ width: '18rem', position: 'relative' }}>
                    <img src={img} className="card-img-top img-fluid" alt={pd_name} />
                    <div className="card-body">
                        <h5 className="card-title">{pd_name}</h5>
                        <p className="card-text">NT$ {price}</p>
                        <a className="btn btn-outline-primary" href='/productpage'>
                            進入商品頁
                        </a>
                        <button className="btn btn-outline-danger" onClick={this.handleShow}>
                            ❤️ 取消收藏
                        </button>
                    </div>
                </div>

                {show && (
                    <div className="modal show fade d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">


                                <div className="modal-body">
                                    <h5>確認取消收藏</h5>
                                    <p>你確定要將「{pd_name}」從收藏中移除嗎？</p>
                                    <div className="modal-buttons">
                                        <button className="btn btn-secondary" onClick={this.handleClose}>關閉</button>
                                        <button className="btn btn-danger" onClick={this.handleConfirmRemove}>確定移除</button>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                )}

            </>
        );
    }
}

export default FavoriteCard;
