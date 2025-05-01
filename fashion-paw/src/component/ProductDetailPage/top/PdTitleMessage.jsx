import React, { Component } from 'react';
import PawDisplay from '../PawDisplay';
class PdTitleMessage extends Component {
    state = {}
    render() {
        const { condition, pid, price, stock, deliveryMethod, brand, city, district, newLevel, newAvgRating, newRatingCount} = this.props  
        return (<>
            {/* <h1>商品重點區</h1> */}
            <div>
                <div className='d-flex my-2'>
                    <div> 商品編號：</div><div>{pid}</div>
                </div>
                {/* 二手出現座標｜新品出現品牌 */}
                {condition === "second" ? <>
                <div className='d-flex my-2'>
                    <div> 商品座標：</div><div>{city}{district}</div>
                </div>
                </>: <>
                <div className='d-flex my-2'>
                    <div> 商品品牌：</div><div>{brand}</div>
                </div>
                </>}
                {/* 二手出現保存狀況｜新品出現商品評價 */}
                {condition === "second" ? <>
                    <div className='d-flex my-2'>
                    <div> 保存狀況：</div>
                    <div><PawDisplay rating={newLevel} /></div>
                </div>
                </>: <>
                <div className='d-flex my-2 '>
                <span> 商品評價：</span>
                <PawDisplay rating={Math.floor(newAvgRating)} />
                <div className="ptxt5 d-flex align-items-end">（<span title="平均分數">{newAvgRating} </span>｜<span title='評論數'>{newRatingCount}</span>）</div>
                </div>
                </>}
                
                <div className='d-flex my-2'>
                    <div> 配送方式：</div>
                    <div>{deliveryMethod.join(' / ')}</div>
                </div>

                <div className={`d-flex align-items-end my-3`}>
                    <div className=''>價格</div>
                    <div className='ptxtb2 paw-text-pink mx-2'>{price}</div>
                    <div>元</div>
                    <div className='mx-3'>
                        <span>還剩</span>
                        <span className='mx-2 ptxtb4 paw-text-pink'>{stock}</span>
                        <span>件</span>
                    </div>
                </div>
            </div>


        </>);
    }
}

export default PdTitleMessage;