import React, { Component } from 'react';
import axios from 'axios';
import cookie from 'js-cookie';

class Coupon extends Component {
  state = {
    coupon: '',
    discountAmount: 0,
    applied: false,     // 是否已套用折扣
    availableCoupons: [],  // 後端折扣碼清單
    showList: false,
    appliedCouponCode: '',
    isLoggedIn: !!cookie.get('user_uid'), // 判斷是否登入
  };

  render() {
    const { coupon, applied, discountAmount, showList, availableCoupons } = this.state;

    return (
      <div className="p-3 border rounded">

        <div className=" my-2">
          {/* <div className='d-flex'>
          <input
            type="text"
            value={coupon}
            onChange={this.inputChange}
            placeholder="請輸入折扣碼"
            className="
            form-control me-2 w-50 "
          />
          <button
            className="btn paw-btn-outline-pri-darkgreen"
            onClick={this.applyCoupon}
          >
            套用
          </button>
          </div> */}

          <div className="my-2">
            <button
              className=" mb-2 btn paw-btn-outline-pri-darkgreen"
              onClick={this.toggleCouponList}
            >
              {showList ? '收起折扣碼 ▲' : '點我看折扣 ▼'}
            </button>

            {showList && availableCoupons.length === 0 && (
              <p className="text-muted mt-2">{this.state.isLoggedIn ? '尚無可用折扣碼' : '請先登入才能使用折扣碼'}</p>
            )}

            {showList && availableCoupons.length > 0 && (
              <div className="d-flex flex-column gap-2 mt-2">
                {availableCoupons.map((c, idx) => {
                  const isUsed = c.coupon_code === this.state.appliedCouponCode;

                  return (
                    <div
                      key={idx}
                      className={`card p-2 d-flex flex-row justify-content-start align-items-center ${isUsed ? 'bg-light text-muted' : ''}`}
                      style={{
                        cursor: isUsed ? 'not-allowed' : 'pointer',
                        opacity: isUsed ? 0.6 : 1
                      }}
                      onClick={() => {
                        if (!isUsed) this.applyCouponFromList(c.coupon_code);
                      }}
                    >
                      <div>

                      </div>
                      <div className="paw-btn-middlebrown m-2 px-3 py-2">{c.discount_ratio * 100} 折</div>
                      <div><strong>{c.coupon_code}</strong></div>

                      <div className='px-3'>
                        {c.description}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {applied && (
          <div className="paw-text-pink mt-2">
            ✅ 成功套用折扣碼～{discountAmount * 100} 折
          </div>
        )}
      </div>
    );
  }

  inputChange = (e) => {
    this.setState({ coupon: e.target.value });
  };

  showCoupons = async () => {
    const uid = cookie.get('user_uid');
    console.log("🔍 目前登入 UID：", uid); // 加這行
    if (!uid) {
      this.setState({ isLoggedIn: false });
      return;
    }

    try {
      const res = await axios.get(`http://localhost:8000/coupons/${uid}`);
      this.setState({ availableCoupons: res.data, showList: true });
    } catch (err) {
      console.error("❌ 載入折扣碼失敗", err);
    }
  };

  applyCoupon = (code = this.state.coupon) => {
    const { availableCoupons } = this.state;

    const codeStr = String(code).trim().toLowerCase(); // ✅ 強制轉字串再比對

    const matched = availableCoupons.find(c =>
      c.coupon_code.toLowerCase() === codeStr
    );

    if (matched) {
      const discountValue = parseFloat(matched.discount_ratio);
      this.setState({
        applied: true,
        discountAmount: discountValue,
        coupon: matched.coupon_code,
        appliedCouponCode: matched.coupon_code
      });
      this.props.onApplyDiscount?.(discountValue);
    } else {
      alert('折扣碼無效');
    }

    console.log("📦 套用折扣碼 matched：", matched);
  };

  toggleCouponList = () => {
    this.setState(
      prev => ({ showList: !prev.showList }),
      () => {
        if (this.state.showList && this.state.availableCoupons.length === 0) {
          this.showCoupons();
        }
      }
    );
  };

  applyCouponFromList = (code) => {
    this.applyCoupon(code); // ✅ 直接傳入 code，避免 undefined
  };


}

export default Coupon;