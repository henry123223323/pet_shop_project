import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Sidebar extends Component {
    state = {
        list: [
            {
                link: "profile",
                content: "個人檔案",
                auth:1
            },
            {
                link: "orders",
                content: "購物清單",
                auth:1
            },
            {
                link: "credit-card",
                content: "綁定信用卡",
                auth:1
            },
            {
                link: "mycollect",
                content: "我的收藏",
                auth:1
            },
            {
                link: "mycoupon",
                content: "我的優惠券",
                auth:1
            },
            {
                link: "myAddress",
                content: "我的地址",
                auth:1
            },
            {
                link: "change-password",
                content: "更改密碼",
                auth:1
            },
            {
                link: "manage-market",
                content: "管理賣場",
                auth:2
            },
            {
                link: "Content-manage",
                content: "後臺管理",
                auth:3
            }

        ]
    }
    render() {
        return (
            <div className="bg-light p-3" style={{ width: "200px" }}>
                <ul className="list-unstyled">
                    {this.state.list.map((obj, index) => {
                        return <li className='btn btn-outline-warning'><Link to={`/MemberCenter/${obj.link}`}>{obj.content}</Link></li>
                    })}

                </ul>
            </div>
        );
    }
}

export default Sidebar;