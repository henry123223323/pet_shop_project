import React, { Component } from 'react';
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

    return (
      <>
        {/* title */}
        <div className='my-2 p-3'>
          <h3>購物車</h3>
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
                    selected={selectedItems.includes(item.cart_id)}
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
                  <SellerTitle sellerName={this.context.getSellerName(uid)} />
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
                      selected={selectedItems.includes(item.cart_id)}
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
  //新品全選
  allSelected = () => {
    const { selectedItems } = this.state;
    const { cartList } = this.context;
    const newItems = cartList.filter(item => item.condition === "new");
    return newItems.every(item => selectedItems.includes(item.cart_id));
  }

  toggleSelectAll = () => {
    const { selectedItems } = this.state;
    const { cartList } = this.context;
    const newItems = cartList.filter(item => item.condition === "new");
    const allIds = newItems.map(item => item.cart_id);

    if (this.allSelected()) {
      // 取消選取
      const updated = selectedItems.filter(id => !allIds.includes(id));
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
    const sellerItems = cartList.filter(item => item.condition === 'second' && item.uid === String(uid));
    return sellerItems.every(item => selectedItems.includes(item.cart_id));
  };
  

  // 切換賣家區域的全選 / 取消
  toggleSellerSelectAll = (uid) => {
    const { selectedItems } = this.state;
    const { cartList } = this.context;
    const sellerItems = cartList.filter(item => item.condition === 'second' && item.uid === String(uid));
    const sellerIds = sellerItems.map(item => item.cart_id);
  
    if (this.sellerAllSelected(uid)) {
      const updated = selectedItems.filter(id => !sellerIds.includes(id));
      this.setState({ selectedItems: updated });
    } else {
      const updated = Array.from(new Set([...selectedItems, ...sellerIds]));
      this.setState({ selectedItems: updated });
    }
  };


  selectChange = (changeId) => {
    this.setState(prevState => {
      const isSelected = prevState.selectedItems.includes(changeId);
      const newSelectedItems = isSelected
        ? prevState.selectedItems.filter(id => id !== changeId)
        : [...prevState.selectedItems, changeId];
      return { selectedItems: newSelectedItems };
    });
  }
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
      selectedItems: prev.selectedItems.filter((id) => id !== cartId),
    }));
    removeFromCart(cartId);
  };

  goToCheckBillPage = () => {
    const { selectedItems, discountAmount } = this.state;
    const { cartList } = this.context;
  
    const selectedCartItems = cartList.filter(item => selectedItems.includes(item.cart_id));
  
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
  
    localStorage.setItem('selectedItems', JSON.stringify(selectedCartItems));
    localStorage.setItem('discountAmount', discountAmount);
    window.location.href = '/CheckBillPage';
  };
}

export default ShoppingCartPage;