import React, { Component } from 'react';
import CartList from './CartList';
import SellerTitle from './SellerTitle';
import Coupon from './Coupon';
import CheckList from './CheckList';
import ConfirmBtn from '../share/ConfirmBtn';

class ShoppingCartPage extends Component {
  state = {
    coupon: "discount88",
    discountAmount: 0,
    cartList: [
      {
        cart_id: 1,
        pid: 501,
        uid: null,
        condition: "new",
        quantity: 2,
        productName: "新品貓窩",
        unit_price: 899,
        image: "/media/second_pd/cat/cat2_home1_2.jpeg",
        color: "灰色"
      },
      {
        cart_id: 2,
        pid: 502,
        uid: 1001,
        condition: "second",
        quantity: 1,
        productName: "二手貓窩-小橘貓",
        unit_price: 499,
        image: "/media/second_pd/cat/cat2_home1_1.jpeg",
        color: "藍色"
      },
      {
        cart_id: 3,
        pid: 503,
        uid: 1002,
        condition: "second",
        quantity: 1,
        productName: "二手狗狗墊-阿柴",
        unit_price: 299,
        image: "/media/second_pd/cat/cat2_home1_3.jpeg",
        color: "咖啡色"
      },
      {
        cart_id: 4,
        pid: 501,
        uid: null,
        condition: "new",
        quantity: 1,
        productName: "新品貓窩-2",
        unit_price: 399,
        image: "/media/second_pd/cat/cat2_home1_2.jpeg",
        color: "灰色"
      },
    ],
    sellers: {
      1001: "小橘貓",
      1002: "阿柴2",
      1: "拾毛百貨"
    },
    selectedItems: [], //有勾選的 cart_id
  };

  render() {
    const { cartList, sellers, selectedItems } = this.state;

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
                    <SellerTitle sellerName={sellers[uid]} />
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
    const { selectedItems, cartList } = this.state;
    const newItems = cartList.filter(item => item.condition === "new");
    return newItems.every(item => selectedItems.includes(item.cart_id));
  }

  toggleSelectAll = () => {
    const { selectedItems, cartList } = this.state;
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
    const { selectedItems, cartList } = this.state;
    const sellerItems = cartList.filter(item => item.condition === 'second' && item.uid === parseInt(uid));
    return sellerItems.every(item => selectedItems.includes(item.cart_id));
  };

  // 切換賣家區域的全選 / 取消
  toggleSellerSelectAll = (uid) => {
    const { selectedItems, cartList } = this.state;
    const sellerItems = cartList.filter(item => item.condition === 'second' && item.uid === parseInt(uid));
    const sellerIds = sellerItems.map(item => item.cart_id);

    if (this.sellerAllSelected(uid)) {
      // 取消全選
      const updated = selectedItems.filter(id => !sellerIds.includes(id));
      this.setState({ selectedItems: updated });
    } else {
      // 全選
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
    if (newQuantity < 1) {
      const deletePd = window.confirm("數量為 0，要將此商品從購物車移除嗎？");
      if (deletePd) {
        this.deleteCartItem(cartId);
      }
      return;
    }
    const updatedCartList = this.state.cartList.map(item => {
      if (item.cart_id === cartId) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    this.setState({ cartList: updatedCartList });
  }

  applyDiscount = (discountAmount) => {
    this.setState({ discountAmount });
  }

  deleteCartItem = (cartId) => {
    const updatedCartList = this.state.cartList.filter(item => item.cart_id !== cartId);
    const updatedSelectedItems = this.state.selectedItems.filter(id => id !== cartId);
    this.setState({
      cartList: updatedCartList,
      selectedItems: updatedSelectedItems
    });
  };

  goToCheckBillPage = () => {
    const { selectedItems, discountAmount, cartList } = this.state;
    const selectedCartItems = cartList.filter(item => selectedItems.includes(item.cart_id));

    if (selectedItems.length === 0) {
      return alert("還沒有選擇商品");
    }

    // 條件 1：不能同時結帳新品與二手
    const selectedConditions = new Set(selectedCartItems.map(item => item.condition));
    if (selectedConditions.size > 1) {
      return alert("新品與二手商品不能同時結帳，請分開操作");
    }

    // 條件 2：若是二手，賣家只能有一個
    if (selectedConditions.has("second")) {
      const sellerUids = new Set(selectedCartItems.map(item => item.uid));
      if (sellerUids.size > 1) {
        return alert("二手商品每次只能結帳一位賣家的商品，請調整勾選內容");
      }
    }

    // 通過條件，儲存資料並導向
    localStorage.setItem('selectedItems', JSON.stringify(selectedCartItems));
    localStorage.setItem('discountAmount', discountAmount);
    window.location.href = '/CheckBillPage';
  }
}

export default ShoppingCartPage;