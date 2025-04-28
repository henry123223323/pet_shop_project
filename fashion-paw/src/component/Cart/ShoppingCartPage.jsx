import React, { Component } from 'react';
import CartList from './CartList';
import SellerTitle from './SellerTitle';
import Coupon from './Coupon';
import CheckList from './CheckList';
import ConfirmBtn from '../share/ConfirmBtn';

class ShoppingCartPage extends Component {
  state = {
    coupon: "discount99",
    cartList: [
      { cart_id: 1, pid: 501, uid: null, condition: "new", quantity: 2, productName: "新品貓窩", unit_price: 899, image: "/media/second_pd/cat/cat2_home1_2.jpeg", color: "灰色" },
      { cart_id: 2, pid: 502, uid: 1001, condition: "second", quantity: 1, productName: "二手貓窩-小橘貓", unit_price: 499, image: "/media/second_pd/cat/cat2_home1_1.jpeg", color: "藍色" },
      { cart_id: 3, pid: 503, uid: 1002, condition: "second", quantity: 1, productName: "二手狗狗墊-阿柴", unit_price: 299, image: "/media/second_pd/cat/cat2_home1_3.jpeg", color: "咖啡色" }
    ],
    sellers: {
      1001: "小橘貓",
      1002: "阿柴",
      1: "拾毛百貨"
    }
  };

  render() {
    const { cartList, sellers } = this.state;

    // 分類：新品 & 二手
    const newItems = cartList.filter(item => item.condition === "new");
    const secondItems = cartList.filter(item => item.condition === "second");

    // 再把二手商品，依賣家分組
    const secondItemsBySeller = {};
    secondItems.forEach(item => {
      if (!secondItemsBySeller[item.uid]) {
        secondItemsBySeller[item.uid] = [];
      }
      secondItemsBySeller[item.uid].push(item);
    });

    return (
      <>
        {/* title */}
        <div className='my-2 p-3'>
          <h3>購物車</h3>
        </div>
        <div className='row g-5'>
          {/* 左邊 */}
          <div className="col-12 col-md-8">
            {/* 新品購物車 */}
            <div className='p-4'>
              <div className='paw-bg-middleorange'>
                <h3 className='p-2'>拾毛百貨</h3>
              </div>
              <div className='border rounded px-1'>
                {newItems.map(item => (
                  <CartList key={item.cart_id} item={item} />
                ))}
              </div>
            </div>

            {/* 二手購物車 */}
            <div className=' p-4'>
              <div className='paw-bg-middleorange'>
                <h3 className='p-2'>拾毛市場</h3>
              </div>

              {Object.keys(secondItemsBySeller).map(uid => (
                <div key={uid} className='border rounded my-2'>
                  {/* 賣家名稱 */}
                  <SellerTitle sellerName={sellers[uid]} />
                  <hr />
                  {/* 賣家商品列表 */}
                  {secondItemsBySeller[uid].map(item => (
                    <CartList key={item.cart_id} item={item} />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* 右邊 */}
          <div className="col-12 col-md-4">
            {/* 折價券 */}
            <div className='p-4'>
              <div className='paw-bg-middleorange'>
                <h3 className='p-2'>折價券</h3>
              </div>
              <Coupon />
            </div>

            {/* 訂單確認 */}
            <div className='p-4'>
              <div className='paw-bg-middleorange'>
                <h3 className='p-2'>結帳明細</h3>
              </div>
              <div className='border rounded'>
                <CheckList />
                <a href="/CheckBillPage"><ConfirmBtn type="toPayPage" /></a>

              </div>

            </div>

          </div>
        </div>



      </>
    );
  }

}

export default ShoppingCartPage;