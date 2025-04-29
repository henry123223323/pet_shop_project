import React, { Component } from 'react';
import Order_detail from './Pd_detail';

class PD_list extends Component {
    state = {
        showDetail: false,
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
        return (<>

            <div className="card p-4 mb-4 shadow-sm">
                <div className="row align-items-center">


                    {/* 訂單資訊 */}
                    <div className="col-md-8 col-12">
                        <div className="row">
                            <div className="col-md-3 col-6">
                                <strong>訂單編號</strong><br />
                                {'#' + this.state.order.ordernum}
                            </div>
                            <div className="col-md-2 col-6">
                                <strong>全新/二手</strong><br />
                                {(this.state.order.neworsecond == "new") ? "全新" : "二手"}
                            </div>
                            <div className="col-md-3 col-6">
                                <strong>訂單日期</strong><br />
                                {this.state.order.orderdate}
                            </div>
                            <div className="col-md-2 col-6">
                                <strong>訂單狀態</strong><br />
                                {this.state.order.orderstate}
                            </div>
                            <div className="col-md-2 col-6">
                                <strong>總金額</strong><br />
                                {'$' + this.state.order.price}
                            </div>
                        </div>
                    </div>
                    {/* 商品圖片 */}
                    <div className="col-md-2 d-none d-md-block text-center">
                        <img src={this.state.order.pd_img} alt="商品圖片" className="img-fluid rounded" />
                    </div>
                    {/* 查看訂單明細 */}
                    <div className="col-md-2 col-8 text-md-end text-end mt-3 mt-md-0">
                        <button className="btn btn-outline-secondary" onClick={this.WatchDetail}>查看</button>
                    </div>
                </div>
            </div>

            {
                this.state.showDetail && (
                    <Order_detail close={this.WatchDetail} product={this.props.product} />
                )
            }
        </>
        );
    }
    WatchDetail = (event) => {
        this.setState({ showDetail: !this.state.showDetail })
    }
}

export default PD_list;
