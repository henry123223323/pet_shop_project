import React, { Component } from 'react';
import cookie from "js-cookie";
import axios from 'axios';



class MyCoupon extends Component {
    constructor(props) {
        super(props)
        this.state = {
            coupon: [
                {
                    coupon_id: 1,
                    discount_ratio: 0.88,
                    coupon_code: "2025LOVEPET",
                    create_at: "2025*05*01",
                    overdate: "2025*06-01",
                    description: ""
                },
                {
                    coupon_id: 1,
                    discount_ratio: 0.88,
                    coupon_code: "2025LOVEPET",
                    create_at: "2025*05*01",
                    overdate: "2025*06-01",
                    description: ""
                },
                {
                    coupon_id: 1,
                    discount_ratio: 0.88,
                    coupon_code: "2025LOVEPET",
                    create_at: "2025*05*01",
                    overdate: "2025*06-01",
                    description: ""
                }
            ]
        }
    }

    getcoupon=()=>{
        let uid = cookie.get("user_uid")

        axios.get(`http://localhost:8000/get/getcoupon/${uid}`).then((response) => {
            console.log("查詢成功:", response.data);
            
            this.setState({
                coupon: response.data
            })

        })
        .catch((error) => {
            console.error("查詢失敗:", error);
        });
    }


    componentDidMount(){
        this.getcoupon()
    }


    render() {
        let { coupon } = this.state
        return (
            <table className="table table-striped table-hover">
                <thead>
                    <tr>
                        <th>coupon_id</th>
                        <th>discount_ratio</th>
                        <th>coupon_code</th>
                        <th>create_at</th>
                        <th>overdate</th>
                        <th>description</th>
                    </tr>
                </thead>
                <tbody>
                    {coupon.map((cop, index) => {
                        return <>
                            <tr key={index}>
                                <td>{cop.coupon_id}</td>
                                <td>{cop.discount_ratio}</td>
                                <td>{cop.coupon_code}</td>
                                <td>{cop.create_at}</td>
                                <td>{cop.overdate}</td>
                                <td>{cop.description}</td>
                            </tr>
                        </>
                    })}
                </tbody>
            </table>
        );
    }
}

export default MyCoupon;