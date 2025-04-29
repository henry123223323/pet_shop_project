import React, { Component } from 'react';
import styles from './SwitchPage.module.css'
class SwitchPage extends Component {

    render() { 
        return (
            <>
            {/* <h1>switch</h1> */}
            <div className='d-flex'>
                <div className={`flex-fill btn paw-btn-outline-pri-darkgreen paw-text-lightenbrown mx-1 ${this.props.currentPage === "description" ? styles.btnClicking : ""}`}
                onClick={()=> this.props.changePage("description")}>商品說明</div>
                <div className={`flex-fill btn paw-btn-outline-pri-darkgreen paw-text-lightenbrown mx-1 ${this.props.currentPage === "seller" ? styles.btnClicking : ""}`}
                onClick={()=> this.props.changePage("seller")}>賣家資訊</div>

            </div>

        
            </>

        );
    }
}
 
export default SwitchPage;