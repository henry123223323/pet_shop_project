import React, { Component } from 'react';
import Order_detail from './Pd_detail';
import cookie from "js-cookie";
import axios from 'axios';


class PD_list extends Component {
    constructor(props) {
        super(props)
        this.state = {
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
    }

    getorderitem = () => {
        axios.get(`http://localhost:8000/get/orderitems/${this.props.product.order_id}`).then((response) => {
            console.log("查詢成功:", response.data);

            this.setState(prevState => ({
                order: {
                    ...prevState.order,
                    order_item: response.data
                }
            }));


        })
            .catch((error) => {
                console.error("刪除失敗:", error);
            });
    }







    componentDidUpdate(prevProps) {
        // 只有在 order_id 改變時才呼叫 getorderitem()
        if (
            this.props.product &&
            (!prevProps.product || this.props.product.order_id !== prevProps.product.order_id)
        ) {
            this.setState({ order: this.props.product }, () => {
                this.getorderitem(); // 在 setState 完成後才執行，避免競爭狀態
                console.log("更新 order 為:", this.props.product);
            });
        }
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
