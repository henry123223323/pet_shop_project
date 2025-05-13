// AddToCartBtn.jsx
import React, { Component } from 'react';
import axios from 'axios';
import cookie from 'js-cookie';
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
          {type === "text" ? "加入購物車" : <i className="bi bi-cart"></i>}
        </button>
      </div>
    );
  }

  addToCart = async () => {
    const { addToCart } = this.context;
    const { product, quantity = 1 } = this.props;
  
    if (!product || !product.pid) {
      alert("⚠️ 商品資料不完整，無法加入購物車");
      return;
    }
  
    const cartItem = {
      pid: product.pid,
      uid: product.uid, // 賣家 ID
      condition: product.condition,
      quantity,
      price: product.price,
      spec: product.color || product.spec || null,
      pd_name: product.pd_name,
      images: product.images,
    };
  
    // ✅ 加入 Context（會自動合併）
    const result = await addToCart(cartItem);
  
    // ✅ 如果登入，則同步寫入資料庫
    const uid = cookie.get("user_uid");
    if (uid) {
      try {
        await axios.post("http://localhost:8000/cart/add", {
          uid,                     // 買家 UID
          pid: product.pid,
          spec: product.color || product.spec || null,
          quantity,
          unit_price: product.unit_price || product.price || 0,
        });
        console.log("✅ 已同步新增至後端資料庫");
      } catch (err) {
        console.error("❌ 同步到後端購物車失敗", err);
      }
    }
  
    if (result === 'new' || result === 'updated') {
      const go = window.confirm("✅ 已加入購物車！是否前往查看？");
      if (go) {
        window.location.href = '/ShoppingCartPage';
      }
    }
  };

}

export default AddToCartBtn;