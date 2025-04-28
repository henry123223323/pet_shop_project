import React, { Component } from 'react';
class Homepage extends Component {
    state = {  } 
    render() { 
        return (
            <>
            <h1>這是主頁</h1>
            <br />
            <a href="http://localhost:3000/SecondPdDetailPage">二手商品頁</a><br />
            <a href="http://localhost:3000/ShoppingCartPage">購物車</a><br />
            <a href="http://localhost:3000/CheckBillPage">結帳</a><br /><br /><br /><br />
            {/* 新品頁 */}
            </>
        );
    }
}
 
export default Homepage;