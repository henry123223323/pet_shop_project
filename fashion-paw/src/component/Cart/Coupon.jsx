import React, { Component } from 'react';

class Coupon extends Component {
  state = {
    coupon: '', 
    discountAmount:0,
    applied: false     // 是否已套用折扣
  };

  render() {
    const { coupon, applied,discountAmount } = this.state;

    return (
      <div className="p-3 border rounded">
        <h4>輸入折扣碼</h4>

        <div className="d-flex my-2">
          <input 
            type="text" 
            value={coupon}
            onChange={this.inputChange}
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
            ✅ 成功套用折扣碼～{discountAmount*100} 折
          </div>
        )}
      </div>
    );
  }

  inputChange = (e) => {
    this.setState({ coupon: e.target.value });
  };

  applyCoupon = () => {
    const { coupon } = this.state;
    let discountAmount = 0;

    if (coupon.trim().toLowerCase() === 'discount88') {
      discountAmount = 0.88;
      this.setState({ applied: true, discountAmount: discountAmount });
    } else {
      this.setState({ applied: false, discountAmount: 0 });
      alert('折扣碼無效，請重新輸入！');
    }

    // 回傳給父層
    if (this.props.onApplyDiscount) {
      this.props.onApplyDiscount(discountAmount);
    }
  };

}

export default Coupon;