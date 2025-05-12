// AddToCartBtn.jsx
import React, { Component } from 'react';
import { CartContext } from 'component/Cart/CartContext';
import styles from './AddToCartBtn.module.css';

class AddToCartBtn extends Component {
  static contextType = CartContext;

  render() {
    const { type } = this.props;

    return (
      <div className='d-flex align-items-center my-3'>
        <button
          className={`btn paw-btn-pink paw-text-lightorange rounded-pill mx-3 ${styles.textShadow} ${styles.cartBtn}`}
          onClick={this.addToCart}
        >
          {type === "text" ? "加入購物車" : (
            <i className="bi bi-cart" style={{ fontSize: this.props.size || "20px" }}></i>
          )}

        </button>
      </div>
    );
  }

  addToCart = async () => {
    const { addToCart } = this.context;
    const { product, quantity = 1 } = this.props;

    const cartItem = {
      ...product,
      quantity, // ✅ 使用 props 傳入的數量
    };
    console.log("🛒 加入購物車的 item：", cartItem);
    if (!product) {
      console.warn("❗ 缺少 product props");
      return;
    }

    const result = await addToCart(cartItem);

    if (result === 'new' || result === 'updated') {
      const go = window.confirm("✅ 已加入購物車！是否前往查看？");
      if (go) {
        window.location.href = '/ShoppingCartPage';
      }
    }
  };

}

export default AddToCartBtn;