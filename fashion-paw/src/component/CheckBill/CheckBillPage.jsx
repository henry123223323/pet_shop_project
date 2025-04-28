import React, { Component } from 'react';
import CheckList from '../Cart/CheckList';
import PayWay from './PayWay'
import DeliverWay from './DeliverWay'
import Receipt from './Receipt';


class CheckBillPage extends Component {

    render() {


        return (
            <>
                {/* title */}
                <div className='my-2 p-3'>
                    <h3>填寫付款資料</h3>
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
                                <DeliverWay />
                            </div>
                        </div>

                        {/* 發票資訊 */}
                        <div className='p-4'>
                            <div className='paw-bg-middleorange'>
                                <h3 className='p-2'>發票資訊</h3>
                            </div>
                            <div className='border rounded px-1'>
                                <Receipt />
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
                                <CheckList />
                            </div>
                        </div>

                    </div>
                </div>



            </>
        );
    }
}

export default CheckBillPage;