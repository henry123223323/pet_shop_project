import React, { Component } from 'react';

class CheckList extends Component {

  render() {
    const { selectedItems, discountAmount } = this.props;

    const totalOriginal = selectedItems.reduce((sum, item) => {
      return sum + item.unit_price * item.quantity;
    }, 0);
    const validDiscount = discountAmount > 0 && discountAmount < 1 ? discountAmount : 1;
    const afterDiscount = totalOriginal * validDiscount;
    const shippingFee = afterDiscount < 599 && afterDiscount > 0 ? 70 : 0;
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
            <span>折扣：</span>
            <span>
              {
                validDiscount < 1
                  ? ` ${(validDiscount * 100).toFixed(0)} 折`
                  : "未使用折價券"
              }
            </span>
          </div>
          <hr />
          <div>
            <span className='ptxtb3'>結帳金額：</span>
            <span>{Math.round(finalAmount).toLocaleString()} 元</span>
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