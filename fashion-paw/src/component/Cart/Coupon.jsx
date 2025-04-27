import React, { Component } from 'react';

class Coupon extends Component {
  state = {
    coupon: '',        // 使用者輸入的折扣碼
    discountAmount: 0, // 折扣金額
    applied: false     // 是否已套用折扣
  };

  render() {
    const { coupon, discountAmount, applied } = this.state;

    return (
      <div className="p-3 border rounded">
        <h4>輸入折扣碼</h4>

        <div className="d-flex my-2">
          <input 
            type="text" 
            value={coupon}
            onChange={this.handleInputChange}
            placeholder="請輸入折扣碼"
            className="form-control me-2 "
          />
          <button 
            className="btn paw-btn-outline-pri-darkgreen"
            onClick={this.applyCoupon}
          >
            套用
          </button>
        </div>

        {applied && (
          <div className="text-success mt-2">
            ✅ 成功套用折扣碼！折扣金額：- {discountAmount} 元
          </div>
        )}
      </div>
    );
  }

  handleInputChange = (e) => {
    this.setState({ coupon: e.target.value });
  };

  applyCoupon = () => {
    const { coupon } = this.state;
    // 假設只認 "discount99" 這個折扣碼
    if (coupon === 'discount99') {
      this.setState({ discountAmount: 99, applied: true });
    } else {
      this.setState({ discountAmount: 0, applied: false });
      alert('折扣碼無效，請重新輸入！');
    }
  };


}

export default Coupon;