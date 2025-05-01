import React, { Component } from 'react';

class CheckList extends Component {

  render() {
    const { selectedItems, discountAmount } = this.props;

    // 1. 計算勾選的商品總金額 A
    const totalOriginal = selectedItems.reduce((sum, item) => {
      return sum + item.unit_price * item.quantity;
    }, 0);

    // 2. 折扣金額 B 已經存在 discountAmount
    // 3. 判斷運費 C
    const afterDiscount = totalOriginal * discountAmount;
    const shippingFee = afterDiscount < 599 && afterDiscount > 0 ? 70 : 0;

    // 4. 結帳金額 = A - B + C
    const finalAmount = afterDiscount + shippingFee;


    return (
      <>
        <div className='px-4'>

          {/* 結帳明細 */}
          <div className='my-2'>
            <span>原價總金額：</span> <span>{totalOriginal.toLocaleString()} </span>
          </div>
          <div className='my-2'>
            <span>運費：</span> <span> {shippingFee.toLocaleString()}</span>
          </div>
          <div className='my-2'>
            <span>折扣：</span> <span> 整單{(discountAmount*100).toLocaleString()}折</span>
          </div>
          <hr />
          <div>
            <span className='ptxtb3'>結帳金額：</span> 
            <span> {Math.round(finalAmount.toLocaleString())} 元</span>
            <p></p>
          </div>
        </div>
      </>
    );
  }

  checkOut = () => {
    alert("結帳button");
  }
}

export default CheckList;