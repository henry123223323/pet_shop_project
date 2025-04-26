import React, { Component} from 'react';
import styles from './AddToCartBtn.module.css'
class AddToCartBtn extends Component {
    constructor(props) {
        super(props);
        this.state = {
          count: 1
        };
      }
    render() { 
        return (
        <>
            {/* <h1>加入購物車</h1> */}
            <div className='d-flex align-items-center my-3'>
               
                {/* 加入購物車 */}
                <button className={`btn paw-btn-pink paw-text-lightorange rounded-pill mx-3 ${styles.textShadow}`}>加入購物車</button>   
            </div>
        </>
        );
    }
}
 
export default AddToCartBtn;