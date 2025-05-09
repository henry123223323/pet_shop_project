import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PdQuantity from '../share/PdQuantity';
import AddToMyFavorite from '../share/AddToMyFavorite';
import cookie from 'js-cookie';
import axios from 'axios';

class CartList extends Component {
  state = {
    uid: cookie.get('user_uid'),
    FavorID: []

  }
  componentDidUpdate() {
    console.log(this.state.FavorID);

  }
  componentDidMount() {
    axios.get(`http://localhost:8000/select/collect/${this.state.uid}/all`)
      .then(res => this.setState({ FavorID: res.data }))

  }
  Change_FavorState = async (pid) => {
    if (this.state.uid) {

      if (this.state.FavorID.includes(pid)) {
        await axios.get(`http://localhost:8000/delete/collect/${this.state.uid}/${pid}`)
        this.setState(prevState => ({
          FavorID: prevState.FavorID.filter(id => id !== pid)
        }));
      }
      else {
        await axios.get(`http://localhost:8000/insert/collect/${this.state.uid}/${pid}`)

        this.setState(prevState => ({
          FavorID: [...prevState.FavorID, pid]
        }));
      }
    }
    else {
      alert('請先登入!!')
    }
  }
  render() {
    const { item, selected } = this.props;
    const { productName, color, unit_price } = item;



    console.log(item)

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
                src={item.image}
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
                  <div className="rounded ptxt5 me-2">
                    <AddToMyFavorite
                      isFavorite={this.state.FavorID.includes(parseInt(item.pid))}
                      onClick={() => this.Change_FavorState(parseInt(item.pid))}
                    />
                  </div>
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