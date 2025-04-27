import React, { Component } from 'react';
import PD_list from './Product_list/Pd_list';
class Orders extends Component {
    state = {
        products: [
            {
                ordernum: "000000001",
                neworsecond: "new",
                orderdate: new Date().toLocaleDateString()+new Date().toLocaleTimeString(),
                orderstate: "已寄件",
                price: 2550,
                pd_img: "/media/member_center/catfood.jpg",
                order_item: [
                    {
                        pid: "1",
                        pd_name: "toys",
                        quantity: 2,
                        unit_price: 100,
                        img_path:"/media/member_center/catfood.jpg"
                    },
                    {
                        pid: "2",
                        pd_name: "food",
                        quantity: 2,
                        unit_price: 100,
                        img_path:"/media/member_center/catfood.jpg"
                    }
                ]
            },
            {
                ordernum: "000000002",
                neworsecond: "second",
                orderdate: new Date().toLocaleDateString()+new Date().toLocaleTimeString(),
                orderstate: "已寄件",
                price: 25500,
                pd_img: "/media/member_center/catfood.jpg",
                order_item: [
                    {
                        pid: "3",
                        pd_name: "health",
                        quantity: 2,
                        unit_price: 100,
                        img_path:"/media/member_center/catfood.jpg"
                    },
                    {
                        pid: "4",
                        pd_name: "snacks",
                        quantity: 2,
                        unit_price: 100,
                        img_path:"/media/member_center/catfood.jpg"
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
        ]
    }
    render() {
        let { products } = this.state
        return (
            <div>
                <h3>購物紀錄</h3>
                <label for="">搜尋</label>
                <input type="search" name="" id="" />
                <div className="container mt-4">
                    {products.map((pd, index) => {
                        return <PD_list key={index} product={pd} />

                    })}
                </div>
            </div>
        );
    }
}

export default Orders;