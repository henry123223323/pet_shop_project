import React, { Component } from 'react';
import axios from 'axios';
import CheckList from '../Cart/CheckList';
import PayWay from './PayWay'
import DeliverWay from './DeliverWay'
import Receipt from './Receipt';
import ConfirmBtn from '../share/ConfirmBtn';


class CheckBillPage extends Component {
    state = {
        selectedItems: [],
        discountAmount: 0,
        showDetails: false,
        deliveryData: {},     // 來自 DeliverWay
        payMethod: '',        // 來自 PayWay
        receiptData: {},      // 來自 Receipt
    }

render() {

    const selectedItems = JSON.parse(localStorage.getItem('selectedItems') || '[]');

    const { showDetails } = this.state;

    return (
        <>

            {/* title */}
            <div className='my-2 p-3'>
                <h3>填寫付款資料</h3>
            </div>

            <div className='container-fluid'>
                {/* 折疊按鈕 */}
                <div
                    className='paw-text-lightenbrown mx-1 d-flex flex-fill btn paw-btn-outline-pri-darkgreen paw-text-lightenbrown'
                    onClick={this.toggleDetails}
                >
                    {showDetails ? "隱藏購買明細" : "顯示購買明細"}
                </div>

                {/* 商品資訊明細（折疊內容） */}
                {showDetails && (
                    <div className='border rounded p-3 mb-4'>
                        {selectedItems.map(item => (
                            <div key={item.cart_id} className='mb-3'>
                                <div className='d-flex align-items-center'>
                                    <img
                                        src={item.image}
                                        alt={item.productName}
                                        style={{ width: '80px', height: '80px', objectFit: 'cover', marginRight: '10px' }}
                                    />
                                    <div className="flex-grow-1">
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
                                <hr />
                            </div>
                        ))}

                    </div>
                )}
            </div>


            <div className='row g-5'>
                {/* 左邊 */}
                <div className="col-12 col-md-8">
                    {/* 寄送方式 */}
                    <div className='p-4'>
                        <div className='paw-bg-middleorange'>
                            <h3 className='p-2'>寄送方式</h3>
                        </div>
                        <div className='border rounded px-1'>
                            <DeliverWay 
                              onChange={(data) => this.setState({ deliveryData: data })}
                              selectedItems={selectedItems}/>
                        </div>
                    </div>

                    {/* 發票資訊 */}
                    <div className='p-4'>
                        <div className='paw-bg-middleorange'>
                            <h3 className='p-2'>發票資訊</h3>
                        </div>
                        <div className='border rounded px-1'>
                            <Receipt selectedItems={selectedItems}/>
                        </div>
                    </div>

                </div>

                {/* 右邊 */}
                <div className="col-12 col-md-4">
                    {/* 付款方式 */}
                    <div className='p-4'>
                        <div className='paw-bg-middleorange'>
                            <h3 className='p-2'>付款方式</h3>
                        </div>
                        <div className='border rounded'>
                            <PayWay />
                        </div>
                    </div>

                    {/* 訂單確認 */}
                    <div className='p-4'>
                        <div className='paw-bg-middleorange'>
                            <h3 className='p-2'>結帳明細</h3>
                        </div>
                        <div className='border rounded'>
                            <CheckList selectedItems={this.state.selectedItems}
                                discountAmount={this.state.discountAmount} />
                            <ConfirmBtn
                                onClick={this.confirmToPay} />
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
}
confirmToPay = async () => {
    const selectedItems = this.state.selectedItems;

    // 1. 整理 orderItem 陣列
    const orderItems = selectedItems.map(item => ({
        pid: item.pid,
        pd_name: item.productName,
        spec: `${item.color} / ${item.condition}`,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.unit_price * item.quantity,
        img_path: item.image
    }));

    // 2. 總金額計算
    const totalPrice = orderItems.reduce((sum, i) => sum + i.total_price, 0);

    // 3. 整理主訂單資料（假設這些值你從子元件用 props 或 state 拿到）
    const orderData = {
        uid: 1001,
        order_type: "一般訂單",
        order_time: new Date().toISOString(),
        display_order_num: "ORD" + Date.now(), // 模擬訂單編號
        total_price: totalPrice,
        pay_way: "信用卡",
        card_last4: "1234",
        delivery_method: "宅配",
        receiver_name: "王小明",
        receiver_phone: "0912345678",
        receiver_address: "106 台北市大安區和平東路一段123號",
        receipt: "電子發票"
    };

    // 4. 一起送到後端
    try {
        const response = await axios.post('/api/orders/create', {
            order: orderData,
            items: orderItems
        });
        if (response.status === 200) {
            alert("訂單已送出！");
            localStorage.clear();
            window.location.href = "/order/success";
        }
    } catch (err) {
        console.error(err);
        alert("送出失敗");
    }
};

}

export default CheckBillPage;