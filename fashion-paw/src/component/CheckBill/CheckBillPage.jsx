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
        const hasNewItem = selectedItems?.some(item => item.condition === "new");
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
                                            src={
                                                item.image
                                                    ? `${item.image}`
                                                    : "/media/default/no-image.png"
                                            }
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
                                    selectedItems={selectedItems} />
                            </div>
                        </div>

                        {/* 發票資訊 */}
                        {hasNewItem &&
                            <div className='p-4'>
                                <div className='paw-bg-middleorange'>
                                    <h3 className='p-2'>發票資訊</h3>
                                </div>
                                <div className='border rounded px-1'>
                                    <Receipt
                                        selectedItems={selectedItems}
                                        onChange={(data) => this.setState({ receiptData: data })}
                                    />
                                </div>
                            </div>}

                    </div>

                    {/* 右邊 */}
                    <div className="col-12 col-md-4">
                        {/* 付款方式 */}
                        <div className='p-4'>
                            <div className='paw-bg-middleorange'>
                                <h3 className='p-2'>付款方式</h3>
                            </div>
                            <div className='border rounded'>
                                <PayWay onChange={(data) => this.setState({
                                    payMethod: data.pay_way,
                                    cardLast4: data.card_last4
                                })} />
                            </div>
                        </div>

                        {/* 訂單確認 */}
                        <div className='p-4'>
                            <div className='paw-bg-middleorange'>
                                <h3 className='p-2'>結帳明細</h3>
                            </div>
                            <div className='border rounded'>
                                <CheckList
                                    selectedItems={this.state.selectedItems}
                                    discountAmount={this.state.discountAmount}
                                    onTotalChange={(total) => this.setState({ finalTotal: total })}
                                />
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

        const fromCart = localStorage.getItem("fromCart") === "true";
        if (!fromCart) {
            alert("請先從購物車選擇商品");
            window.location.href = "/ShoppingCartPage";
            return;
        }
        localStorage.removeItem("fromCart");


        const selectedItems = JSON.parse(localStorage.getItem('selectedItems')) || [];
        const discountAmount = Number(localStorage.getItem('discountAmount')) || 0;

        if (selectedItems.length === 0) {
            alert("查無商品資料，請重新從購物車進入");
            window.location.href = "/ShoppingCartPage";
            return;
        }    

        this.setState({ selectedItems, discountAmount });
    }
    toggleDetails = () => {
        this.setState(prev => ({ showDetails: !prev.showDetails }));
    }
    confirmToPay = async () => {
        const { selectedItems, deliveryData, payMethod, receiptData, cardLast4, finalTotal } = this.state;

        const isNew = selectedItems.some(item => item.condition === "new");
    
        const missingFields = [];
    
        // ✅ 檢查寄送資料
        const deliveryRequired = [ 'method',
            'receiver_name',
            'receiver_phone',
            'receiver_address',
            'shop_type',
            'selectedCity',
            'selectedDistrict'];
        const deliveryMissing = deliveryRequired.filter(field => !deliveryData?.[field] || deliveryData[field].trim() === '');
        if (deliveryMissing.length > 0) {
            missingFields.push("寄送資訊");
        }
        
    
        // ✅ 檢查付款方式
        if (!payMethod) {
            missingFields.push("付款方式");
        }
    
        // ✅ 新品需要發票
        if (isNew && (!receiptData?.value || receiptData.value.trim() === "")) {
            missingFields.push("發票資訊");
        }
    
        // ✅ 如果有缺漏，就 alert 出來
        if (missingFields.length > 0) {
            alert(`請完整填寫以下欄位：\n${missingFields.join("、")}`);
            return;
        }
        // ✅ 整理訂單項目
        const orderItems = selectedItems.map(item => ({
            pid: item.pid,
            pd_name: item.productName,
            spec: `${item.color} / ${item.condition}`,
            quantity: item.quantity,
            unit_price: item.unit_price,
            total_price: item.unit_price * item.quantity,
            img_path: item.image
        }));
    
        // ✅ 整理訂單主檔
        const orderId = "HSM" + Date.now();
        const orderData = {
            uid: 205, // 模擬登入用戶
            order_type: selectedItems[0]?.condition,
            display_order_num: orderId,
            total_price: finalTotal,
            pay_way: payMethod,
            card_last4: cardLast4 || null,
            delivery_method: deliveryData.method,
            receiver_name: deliveryData.receiver_name,
            receiver_phone: deliveryData.receiver_phone,
            receiver_address: deliveryData.receiver_address,
            receipt: receiptData?.value || '未填'
        };
    
        console.log("🧾 訂單資料：", orderData);
        console.log("📦 訂單項目：", orderItems);
    
        // ✅ 送出訂單資料到後端
        try {
            const res = await axios.post('http://localhost:8000/orders/create', {
                order: orderData,
                items: orderItems
            });
    
            if (res.status === 200) {
                const { data } = await axios.post('http://localhost:8000/payment/create-order', {
                    orderId,
                    amount: orderData.total_price,
                    itemName: orderItems.map(item => item.pd_name).join(", ")
                });
    
                // ✅ 自動送出付款表單
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