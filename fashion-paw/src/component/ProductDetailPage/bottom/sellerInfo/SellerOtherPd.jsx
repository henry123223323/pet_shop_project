import React, { Component } from 'react';
import styles from './SellerOtherPd.module.css'
import AddToMyFavorite from '../../top/AddToMyFavorite';
import AddToCartBtn from '../../top/AddToCartBtn';
class PdInfo extends Component {
    state = {}
    render() {
        return (<>

            {/* 商品區 */}
            <div className='paw-bg-pri-darkbrown py-1'>

            <p className=' px-3 py-2 ptxtb2'>賣家的其他商品</p>
                <div className={`position-relative ${styles.main}`}>
                    {/* 左鍵 */}
                    <div className="d-flex justify-content-center align-items-center">
                        <i
                            className="paw-btn-outline-middlegreen bi bi-caret-left-fill ptxt2"
                            onClick={this.leftArrowClick}
                        ></i>
                    </div>

                    {/* 商品區 */}
                    <div className='overflow-hidden d-flex flex-nowrap'>
                        {/* 1 */}
                        <div className="card rounded mx-1" style={{ minWidth: '150px' }}>
                            {/* 按圖要可以連結到商品 */}
                            <img src="/media/second_pd/cat/cat2_home1_1.jpeg" className="card-img-top p-2" alt="二手商品圖" />
                            <div className="px-3">
                                {/* 要變連結 */}
                                <span className="ptxtb4">灰色毛氈立方貓窩（可折疊）</span>
                                <div className='d-flex justify-content-center'>
                                    <AddToCartBtn type="icon" />
                                    <AddToMyFavorite />
                                </div>
                            </div>
                        </div>
                        {/* 2 */}
                        <div className="card rounded mx-1" style={{ minWidth: '150px' }}>
                            {/* 按圖要可以連結到商品 */}
                            <img src="/media/second_pd/cat/cat2_home1_1.jpeg" className="card-img-top p-2" alt="二手商品圖" />
                            <div className="px-3">
                                {/* 要變連結 */}
                                <span className="ptxtb4">灰色毛氈立方貓窩（可折疊）</span>
                                <div className='d-flex justify-content-center'>
                                    <AddToCartBtn type="icon" />
                                    <AddToMyFavorite />
                                </div>
                            </div>
                        </div>
                        {/* 3 */}
                        <div className="card rounded mx-1" style={{ minWidth: '150px' }}>
                            {/* 按圖要可以連結到商品 */}
                            <img src="/media/second_pd/cat/cat2_home1_1.jpeg" className="card-img-top p-2" alt="二手商品圖" />
                            <div className="px-3">
                                {/* 要變連結 */}
                                <span className="ptxtb4">灰色毛氈立方貓窩（可折疊）</span>
                                <div className='d-flex justify-content-center'>
                                    <AddToCartBtn type="icon" />
                                    <AddToMyFavorite />
                                </div>
                            </div>
                        </div>
                        {/* 4 */}
                        <div className="card rounded mx-1" style={{ minWidth: '150px' }}>
                            {/* 按圖要可以連結到商品 */}
                            <img src="/media/second_pd/cat/cat2_home1_1.jpeg" className="card-img-top p-2" alt="二手商品圖" />
                            <div className="px-3">
                                {/* 要變連結 */}
                                <span className="ptxtb4">灰色毛氈立方貓窩（可折疊）</span>
                                <div className='d-flex justify-content-center'>
                                    <AddToCartBtn type="icon" />
                                    <AddToMyFavorite />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 右鍵 */}
                    <div className="d-flex justify-content-center align-items-center ">
                        <i
                            className="paw-btn-outline-middlegreen bi bi-caret-right-fill ptxt2"
                            onClick={this.rightArrowClick}
                        ></i>
                    </div>
                </div>
            </div>
        </>);
    }
    leftArrowClick = () => {
        alert("左：還沒做移動鍵")
      };
    
      rightArrowClick = () => {
       alert("右：還沒做移動鍵");
      }
}

export default PdInfo;