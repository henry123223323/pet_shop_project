// 這是加入購物車按鈕

import React, { Component } from 'react';
import styles from './AddToCartBtn.module.css'
class AddToCartBtn extends Component {

    render() {
        const {type , onClick} = this.props
        return (
            <>
                {/* <h1>加入購物車</h1> */}
                <div className='d-flex align-items-center my-3'>

                    <button className={`btn paw-btn-pink paw-text-lightorange rounded-pill mx-3 ${styles.textShadow} ${styles.cartBtn}`}
                    onClick={onClick}>
                        {type === "text" ? "加入購物車" : <i className="bi bi-cart"></i>
 }
                    </button>
                </div>
                
            </>
        );
    }

}

export default AddToCartBtn;