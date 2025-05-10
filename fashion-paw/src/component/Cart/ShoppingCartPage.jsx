import React, { Component } from 'react';
import axios from 'axios';
import CartList from './CartList';
import SellerTitle from './SellerTitle';
import Coupon from './Coupon';
import CheckList from './CheckList';
import ConfirmBtn from '../share/ConfirmBtn';
import { CartContext } from './CartContext';

class ShoppingCartPage extends Component {
  static contextType = CartContext;
  state = {
    coupon: "discount88",
    discountAmount: 0,
    selectedItems: [], //有勾選的 cart_id
  };

  render() {
    const { selectedItems } = this.state
    const { cartList } = this.context;
    // console.log("🛒 購物車頁面收到的 cartList：", cartList);

    
    // 分類：新品 & 二手
    const newItems = cartList.filter(item => item.condition === "new");
    const secondItems = cartList.filter(item => item.condition === "second");

    // 二手商品依賣家分組
    const secondItemsBySeller = {};
    secondItems.forEach(item => {
      if (!secondItemsBySeller[item.uid]) {
        secondItemsBySeller[item.uid] = [];
      }
      secondItemsBySeller[item.uid].push(item);
    });
    console.log("🧪 全部購物車 cartList：", cartList);
    return (
      <>
        {/* title */}
        <div className='my-2 p-3'>
          <h3>購物車</h3>
        </div>
        {/* 開發用：清空 localStorage 按鈕 */}
        <div className="text-end my-3 px-4">
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={() => {
              this.context.clearCart();
            }}
          >
            🧹 清空購物車（Context + localStorage）
          </button>
        </div>
        <div className='row g-5'>
          {/* 左邊 */}
          <div className="col-12 col-md-8">

            {/* 新品購物車 */}
            {newItems.length > 0 && (<div className='p-4'>
              <div className='paw-bg-middleorange'>
                <h3 className='p-3'>拾毛百貨</h3>
              </div>

              <div className='border rounded px-1'>
                <div className='d-flex align-items-center  p-2 border-bottom'
                >
                  <input
                    id='selectAll'
                    type='checkbox'
                    checked={this.allSelected()}
                    onChange={this.toggleSelectAll}
                    className='me-2 mx-2'
                  />
                  <label htmlFor='selectAll'
                    style={{ paddingTop: '5px' }}>全選</label>
                </div>

                {newItems.map(item => (
                  <CartList
                    key={item.cart_id}
                    item={item}
                    selected={selectedItems.includes(String(item.cart_id))}
                    onSelectedChange={this.selectChange}
                    onQuantityChange={this.changeQuantity}
                    onDelete={this.deleteCartItem}
                  />
                ))}
              </div>
            </div>)}

            {/* 二手購物車 */}
            {secondItems.length > 0 && (<div className='p-4'>
              <div className='paw-bg-middleorange'>
                <h3 className='p-3'>拾毛市場</h3>
              </div>

              {Object.keys(secondItemsBySeller).map(uid => (
                <div key={uid} className='border rounded my-2'>
                  <div className='border-bottom px-3'>
                    <SellerTitle  uid={uid} />
                  </div>
                  <div className='d-flex align-items-center  p-2 border-bottom'
                  >
                    <input
                      id={`selectAll-${uid}`}
                      type='checkbox'
                      checked={this.sellerAllSelected(uid)}
                      onChange={() => this.toggleSellerSelectAll(uid)}
                      className='me-2 mx-2'
                    />
                    <label htmlFor={`selectAll-${uid}`} style={{ paddingTop: '5px' }}>
                      全選
                    </label>
                  </div>
                  {secondItemsBySeller[uid].map(item => (
                    
                    <CartList
                      key={item.cart_id}
                      item={item}
                      selected={selectedItems.includes(String(item.cart_id))}
                      onSelectedChange={this.selectChange}
                      onQuantityChange={this.changeQuantity}
                      onDelete={this.deleteCartItem}
                    />
                  ))}
                </div>
              ))}
            </div>
            )}
          </div>

          {/* 右邊 */}
          <div className="col-12 col-md-4">
            {/* 折價券 */}
            <div className='p-4'>
              <div className='paw-bg-middleorange'>
                <h3 className='p-2'>折價券</h3>
              </div>
              <Coupon
                onApplyDiscount={this.applyDiscount} />
            </div>

            {/* 訂單確認 */}
            <div className='p-4'>
              <div className='paw-bg-middleorange'>
                <h3 className='p-2'>結帳明細</h3>
              </div>
              <div className='border rounded'>
                <CheckList
                  selectedItems={cartList.filter(item => selectedItems.includes(item.cart_id))}
                  discountAmount={this.state.discountAmount}

                />

                <ConfirmBtn type="toPayPage" onClick={this.goToCheckBillPage} />

              </div>
            </div>

          </div>
        </div>

      </>
    );
  }
  prevFetchedUids = [];

  componentDidUpdate() {
    const { cartList, setSellers } = this.context;

    const secondUids = [...new Set(
      cartList
        .filter(item => item.condition === "second" && item.uid)
        .map(item => String(item.uid))
    )];

    // 檢查：是否有「新加入但之前沒抓過」的 uid
    const newUids = secondUids.filter(uid => !this.prevFetchedUids.includes(uid));

    if (newUids.length > 0) {
      axios.get(`http://localhost:8000/get/userinfo`)
        .then(res => {
          const uidSet = new Set(secondUids);
          const matchedUsers = res.data.filter(user =>
            uidSet.has(String(user.uid))
          );
          console.log("✅ 更新抓 seller：", matchedUsers);
          setSellers(matchedUsers);
          this.prevFetchedUids = secondUids; // ✅ 更新追蹤過的 uid
        })
        .catch(err => {
          console.error("❌ 抓 seller 錯誤：", err);
        });
    }
  }

  componentDidMount() {
    console.log("🟡 ShoppingCartPage componentDidMount 被執行");
    this.setState({ selectedItems: [] });

    const { cartList, setSellers } = this.context;
  
    const secondUids = [...new Set(
      cartList
        .filter(item => item.condition === "second" && item.uid)
        .map(item => String(item.uid)) // 統一轉字串
    )];
  
    if (secondUids.length > 0) {
      axios.get(`http://localhost:8000/get/userinfo`)
        .then(res => {
          const uidSet = new Set(secondUids);
          console.log("🧪 當前二手商品 UID 清單：", secondUids);
          const matchedUsers = res.data.filter(user =>
            uidSet.has(String(user.uid)) // 同樣比對字串
          );
  
          console.log("✅ 確定比對進來的 sellers：", matchedUsers);
          setSellers(matchedUsers);
        });
    }

    
  }

  //新品全選
  allSelected = () => {
    const { selectedItems } = this.state;
    const { cartList } = this.context;
    const newItems = cartList.filter(item => item.condition === "new");
    return newItems.every(item => selectedItems.includes(String(item.cart_id)));

  }

  toggleSelectAll = () => {
    const { selectedItems } = this.state;
    const { cartList } = this.context;
    const newItems = cartList.filter(item => item.condition === "new");
    const allIds = newItems.map(item => String(item.cart_id));

    if (this.allSelected()) {
      // 取消選取
      const updated = selectedItems.filter(id => !allIds.includes(String(id)));
      this.setState({ selectedItems: updated });
    } else {
      // 全選
      const updated = Array.from(new Set([...selectedItems, ...allIds]));
      this.setState({ selectedItems: updated });
    }
  }
  //二手全選
  // 檢查是否該賣家的商品都有被選
  sellerAllSelected = (uid) => {
    const { selectedItems } = this.state;
    const { cartList } = this.context;
    const sellerItems = cartList.filter(
      item => item.condition === 'second' && String(item.uid) === String(uid)
    );

    const result = sellerItems.every(item => selectedItems.includes(String(item.cart_id)));
  
    console.log("🧪 檢查賣家全選判斷", {
      uid,
      sellerItemIds: sellerItems.map(i => i.cart_id),
      selectedItems,
      result
    });
  
    return result;
  };


  // 切換賣家區域的全選 / 取消
  toggleSellerSelectAll = (uid) => {
    const { selectedItems } = this.state;
    const { cartList } = this.context;
    const sellerItems = cartList.filter(item => item.condition === 'second' && item.uid === String(uid));
    const sellerIds = sellerItems.map(item => String(item.cart_id)); 

    if (this.sellerAllSelected(uid)) {
      const updated = selectedItems.filter(id => !sellerIds.includes(id));
      this.setState({ selectedItems: updated });
    } else {
      const updated = Array.from(new Set([...selectedItems, ...sellerIds]));
      this.setState({ selectedItems: updated });
    }
  };


  selectChange = (changeId) => {
    const idStr = String(changeId);
    this.setState(prevState => {
      const isSelected = prevState.selectedItems.includes(idStr);
      const newSelectedItems = isSelected
        ? prevState.selectedItems.filter(id => id !== idStr)
        : [...prevState.selectedItems, idStr];
      return { selectedItems: newSelectedItems };
    });
  };

  changeQuantity = (cartId, newQuantity) => {
    const { updateQuantity, removeFromCart } = this.context;
    if (newQuantity < 1) {
      const deletePd = window.confirm("數量為 0，要將此商品從購物車移除嗎？");
      if (deletePd) {
        removeFromCart(cartId);
      }
      return;
    }
    updateQuantity(cartId, newQuantity);
  };

  applyDiscount = (discountAmount) => {
    this.setState({ discountAmount });
  }

  deleteCartItem = (cartId) => {
    const { removeFromCart } = this.context;
    this.setState((prev) => ({
      selectedItems: prev.selectedItems.filter((id) => id !== String(cartId)),
    }));
    removeFromCart(cartId);
  };

  goToCheckBillPage = () => {
    const { selectedItems, discountAmount } = this.state;
    const { cartList } = this.context;

    const selectedCartItems = cartList.filter(item =>
      selectedItems.includes(String(item.cart_id))
    );

    if (selectedItems.length === 0) {
      return alert("還沒有選擇商品");
    }

    const selectedConditions = new Set(selectedCartItems.map(item => item.condition));
    if (selectedConditions.size > 1) {
      return alert("新品與二手商品不能同時結帳，請分開操作");
    }

    if (selectedConditions.has("second")) {
      const sellerUids = new Set(selectedCartItems.map(item => item.uid));
      if (sellerUids.size > 1) {
        return alert("二手商品每次只能結帳一位賣家的商品，請調整勾選內容");
      }
    }

    localStorage.setItem(
      'selectedItems',
      JSON.stringify(selectedCartItems.map(item => String(item.cart_id)))
    );
    localStorage.setItem('discountAmount', discountAmount);
    window.location.href = '/CheckBillPage';
  };
}

export default ShoppingCartPage;