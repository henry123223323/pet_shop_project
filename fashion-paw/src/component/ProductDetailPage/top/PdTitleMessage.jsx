import React, { Component } from 'react';
class PdTitleMessage extends Component {
    state = {  } 
    render() { 
        return (<>
        {/* <h1>商品重點區</h1> */}

        
        <div className='d-flex my-2'>
            <div> 商品座標：</div><div>台中市南屯區</div>
        </div>
        <div className='d-flex my-2'>
            <div> 保存狀況：</div>
            <div>3星</div>
        </div>
        <div className='d-flex my-2'>
            <div> 交貨方式：</div>
            <div>面交/宅配/超商取貨</div>
        </div>

        <div className={`d-flex align-items-end my-3`}>
            <div className=''>價格</div>
            <div className='ptxtb2 paw-text-pink mx-2'>199</div>
            <div>元</div>
            <div className='mx-3'>
                <span>還剩</span>
                <span className='mx-2 ptxtb4 paw-text-pink'>1</span> 
                <span>件</span>
            </div>
        </div>
        
        </>);
    }
}
 
export default PdTitleMessage;