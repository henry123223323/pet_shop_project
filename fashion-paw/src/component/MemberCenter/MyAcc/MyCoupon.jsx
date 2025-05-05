import React, { Component } from 'react';
class MyCoupon extends Component {
    state = {
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