import './CheckBillPage.module.css';
import React, { Component } from 'react';
import axios from 'axios';
import CheckList from '../Cart/CheckList';
import PayWay from './PayWay';
import DeliverWay from './DeliverWay';
import Receipt from './Receipt';
import ConfirmBtn from '../share/ConfirmBtn';
import styles from './CheckBillPage.module.css';

class CheckBillPage extends Component {
  state = {
    selectedItems: [],
    discountAmount: 0,
    showDetails: false,
    deliveryData: {},
    payMethod: '',
    receiptData: {},
  };

  render() {
    const selectedItems = JSON.parse(localStorage.getItem('selectedItems') || '[]');
    const hasNewItem = selectedItems?.some(item => item.condition === "new");
    const { showDetails } = this.state;

    return (
      <>
        <div className='my-2 p-3'>
          <h3 className={styles.pageTitle}>填寫付款資料</h3>
        </div>

        <div className='container-fluid'>
          <button className={styles.toggleButton} onClick={this.toggleDetails}>
            {showDetails ? "隱藏購買明細" : "顯示購買明細"}
          </button>

          {showDetails && (
            <div className={styles.sectionBlock}>
              {selectedItems.map(item => (
                <div key={item.cart_id} className={styles.itemRow}>
                  <img
                    src={item.image ? `${item.image}` : "/media/default/no-image.png"}
                    alt={item.productName}
                    className={styles.itemImage}
                  />
                  <div className={styles.itemDetails}>
                    <div className="d-flex justify-content-between">
                      <strong>{item.productName}</strong>
                      <div>單價：NT$ {item.unit_price}</div>
                    </div>
                    <div className="d-flex justify-content-between">
                      <div>數量：{item.quantity}</div>
                      <div>小計：NT$ {item.unit_price * item.quantity}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className='row g-5'>
          <div className="col-12 col-md-8">
            <div className='p-4'>
              <div className={styles.sectionTitle}>寄送方式</div>
              <div className={styles.sectionBlock}>
                <DeliverWay
                  onChange={(data) => this.setState({ deliveryData: data })}
                  selectedItems={selectedItems}
                />
              </div>
            </div>

            {hasNewItem && (
              <div className='p-4'>
                <div className={styles.sectionTitle}>發票資訊</div>
                <div className={styles.sectionBlock}>
                  <Receipt
                    selectedItems={selectedItems}
                    onChange={(data) => this.setState({ receiptData: data })}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="col-12 col-md-4">
            <div className='p-4'>
              <div className={styles.sectionTitle}>付款方式</div>
              <div className={styles.sectionBlock}>
                <PayWay
                  onChange={(data) => this.setState({
                    payMethod: data.pay_way,
                    cardLast4: data.card_last4
                  })}
                />
              </div>
            </div>

            <div className='p-4'>
              <div className={styles.sectionTitle}>結帳明細</div>
              <div className={styles.sectionBlock}>
                <CheckList
                  selectedItems={this.state.selectedItems}
                  discountAmount={this.state.discountAmount}
                  onTotalChange={(total) => this.setState({ finalTotal: total })}
                />
                <ConfirmBtn onClick={this.confirmToPay} className={styles.confirmButton} />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  componentDidMount() {
    const selectedItems = JSON.parse(localStorage.getItem('selectedItems')) || [];
    const discountAmount = Number(localStorage.getItem('discountAmount')) || 0;
    this.setState({ selectedItems, discountAmount });
  }

  toggleDetails = () => {
    this.setState(prev => ({ showDetails: !prev.showDetails }));
  };

  confirmToPay = async () => {
    const selectedItems = this.state.selectedItems;
    const orderItems = selectedItems.map(item => ({
      pid: item.pid,
      pd_name: item.productName,
      spec: `${item.color} / ${item.condition}`,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.unit_price * item.quantity,
      img_path: item.image
    }));

    const totalPrice = this.state.finalTotal;
    const { deliveryData, payMethod, receiptData } = this.state;
    let order_type = this.state.selectedItems[0]?.condition;
    const orderId = "HSM" + Date.now();

    const orderData = {
      uid: 205,
      order_type,
      display_order_num: orderId,
      total_price: totalPrice,
      pay_way: payMethod || "未填寫",
      card_last4: this.state.cardLast4 || null,
      delivery_method: deliveryData.method,
      receiver_name: deliveryData.receiver_name,
      receiver_phone: deliveryData.receiver_phone,
      receiver_address: deliveryData.receiver_address,
      receipt: receiptData?.value || '未填'
    };

    console.log("🧾 訂單資料：", orderData);
    console.log("📦 訂單項目：", orderItems);

    try {
      const response = await axios.post('http://localhost:8000/orders/create', {
        order: orderData,
        items: orderItems
      });

      if (response.status === 200) {
        const { data } = await axios.post('http://localhost:8000/payment/create-order', {
          orderId: orderId,
          amount: orderData.total_price,
          itemName: orderItems.map(item => item.pd_name).join(", ")
        });

        const div = document.createElement('div');
        div.innerHTML = data;
        document.body.appendChild(div);
        div.querySelector('form').submit();
      }
    } catch (error) {
      console.error("❌ 訂單建立失敗：", error);
      alert("訂單送出失敗，請稍後再試");
    }
  };
}

export default CheckBillPage;
