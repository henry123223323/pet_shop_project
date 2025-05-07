import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PdQuantity from '../share/PdQuantity';
import AddToMyFavorite from '../share/AddToMyFavorite';

class CartList extends Component {
  render() {
    const { item, selected } = this.props;
    const { productName, image, color, unit_price, condition } = item;

    const imagePath = item.condition === "new" ? "/media/new_pd/" : "/media/second_pd/";
    const imgSrc = item.images?.[0]?.img_path
      ? `${imagePath}${item.images[0].img_path}`
      : item.image
        ? `${imagePath}${item.image}`
        : "/media/default/no-image.png";
    // console.log(imgSrc)

    return (
      <div className='p-3 m-3'>
        <div className="row align-items-center justify-content-start border-bottom pb-3 mb-3">
          {/* 勾選框 */}
          <div className='mt-1 col-1 d-flex justify-content-center align-items-center'>
            <input type="checkbox" className="form-check-input"
              checked={!!selected}
              onChange={() => this.props.onSelectedChange(this.props.item.cart_id)} />
          </div>

          {/* 商品圖片 */}
          <div className="col-3 d-flex justify-content-center align-items-center">

            <Link to={`/product/${item.pid}`}>
              <img
                src={imgSrc}
                alt="商品圖片"
                style={{
                  width: '100px',
                  height: '100px',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
            </Link>
          </div>

          {/* 商品文字區塊 */}
          <div className="col-5">
            <Link to={`/product/${item.pid}`} className="ptxtb4 d-block">
              <div className="fw-bold mb-1 paw-text-darkgreen">{productName}</div>
            </Link>

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
                  onQuantityChange={(newQty) => this.props.onQuantityChange(item.cart_id, newQty)}
                  allowZero />
              </div>

              {/* 收藏刪除按鈕 */}
              <div className="d-flex justify-content-center">
                <div className="rounded ptxt5 me-2">
                  <AddToMyFavorite />
                </div>
                <button className="btn btn-sm rounded ptxt2"
                  style={{
                    outline: "none",
                    boxShadow: "none"
                  }}
                  onClick={() => {
                    if (window.confirm("確定要從購物車刪除這項商品嗎？")) {
                      this.props.onDelete(this.props.item.cart_id);
                    }
                  }}>
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