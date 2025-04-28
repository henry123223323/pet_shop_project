import React, { Component } from 'react';
import PdQuantity from '../share/PdQuantity';
import AddToMyFavorite from '../share/AddToMyFavorite';

class CartList extends Component {
  render() {
    const { item, selected } = this.props;
    const { productName, image, color, unit_price } = item;

    return (
      <div className='p-3 m-3'>
        <div className="row align-items-center justify-content-start border-bottom pb-3 mb-3">
          {/* 勾選框 */}
          <div className='mt-1 col-1 d-flex justify-content-center align-items-center'>
            <input type="checkbox" className="form-check-input" 
            checked={!!selected} 
            onChange={() => this.props.onSelectedChange(this.props.item.cart_id)}/>
          </div>

          {/* 商品圖片 */}
          <div className="col-3 d-flex justify-content-center align-items-center">
            <img
              src={image}
              alt="商品圖片"
              style={{
                width: '100px',
                height: '100px',
                objectFit: 'cover',
                display: 'block'
              }}
            />
          </div>

          {/* 商品文字區塊 */}
          <div className="col-5">
            <div className="fw-bold mb-1">{productName}</div>
            <div className="text-muted small mb-2">{color}</div>
            <div className="text-danger fw-bold me-3">{unit_price} 元</div>
          </div>

          {/* 數量、收藏刪除 */}
          <div className="col-3">
            <div className="d-flex flex-column justify-content-center align-items-center">
              {/* 數量調整器 */}
              <div className="d-flex justify-content-center">
                <PdQuantity 
                quantity={item.quantity}
                onQuantityChange={(newQty) => this.props.onQuantityChange(item.cart_id, newQty)}/>
              </div>

              {/* 收藏刪除按鈕 */}
              <div className="d-flex justify-content-center">
                <div className="rounded ptxt5 me-2">
                  <AddToMyFavorite />
                </div>
                <button className="btn btn-sm rounded ptxt2">
                  <i className="bi bi-trash mx-2 paw-text-darkgreen"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


export default CartList;