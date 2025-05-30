import React, { Component } from 'react';
class Order_detail extends Component {
    state = {
        order: {
            ordernum: "000000002",
            neworsecond: "second",
            orderdate: new Date().toLocaleDateString() + new Date().toLocaleTimeString(),
            orderstate: "已寄件",
            price: 25500,
            pd_img: "/media/member_center/catfood.jpg",
            order_item: [
                {
                    pid: "3",
                    pd_name: "health",
                    quantity: 2,
                    unit_price: 100,
                    img_path: "/media/member_center/catfood.jpg"
                },
                {
                    pid: "4",
                    pd_name: "snacks",
                    quantity: 2,
                    unit_price: 100,
                    img_path: "/media/member_center/catfood.jpg"
                },
                {
                    pid: "4",
                    pd_name: "snacks",
                    quantity: 2,
                    unit_price: 100,
                    img_path: "/media/member_center/catfood.jpg"
                }
            ]
        }
    }
    componentDidMount() {
        let newState = { ...this.state }
        newState.order = this.props.product
        this.setState(newState)
    }
    render() {
        return (
            <>
                <div className="modal  show fade d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-xl" role="document">
                        <div className="modal-content">
                            <div className="modal-header">

                            <span className='badge badge-warning rounded-pill'>{this.state.order.ordernum}</span>
                            <span className='badge badge-warning rounded-pill'>{(this.state.order.neworsecond == "new") ? "全新" : "二手"}</span>
                            <span className='badge badge-warning rounded-pill'>{this.state.order.orderstate}</span>
                            <span className='badge badge-warning rounded-pill'>{this.state.order.orderdate}</span>
                            <span className='badge badge-warning rounded-pill'>{this.state.order.price}</span>
                                <button type="button" className="close btn" onClick={this.props.close}>
                                    <span>&times;</span>
                                </button>
                            </div>


                            <div className="modal-body">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>商品編號</th>
                                            <th>商品名稱</th>
                                            <th>數量</th>
                                            <th>單價</th>
                                            <th>總價</th>
                                            <th>圖片</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.order.order_item.map((pd, index) => (
                                            <tr key={index}>
                                                <td>{pd.pid}</td>
                                                <td>{pd.pd_name}</td>
                                                <td>{pd.quantity}</td>
                                                <td>{pd.unit_price}</td>
                                                <td>{pd.quantity * pd.unit_price}</td>
                                                <td><img src={pd.img_path} alt="" style={{ width: "60px" }} /></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                            </div>
                            <div className="modal-footer">

                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default Order_detail;