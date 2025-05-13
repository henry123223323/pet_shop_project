import React, { Component } from 'react';
import styles from './SwitchPage.module.css'
class SwitchPage extends Component {

    render() {
        const {condition, changePage,currentPage} = this.props
        return (
            <>
                {/* <h1>switch</h1> */}
                <div className='d-flex'>
                    <div className={`flex-fill btn paw-btn-outline-pri-darkgreen paw-text-lightenbrown mx-1 ${currentPage === "description" ? styles.btnClicking : ""}`}
                        onClick={() => changePage("description")}>商品說明</div>
                    <div className={`flex-fill btn paw-btn-outline-pri-darkgreen paw-text-lightenbrown mx-1 ${currentPage === "seller" ? styles.btnClicking : ""}`}
                        onClick={() => changePage("seller")}>{condition === "new" ? "商品評論" :"賣家資訊"}</div>

                </div>


            </>

        );
    }
}

export default SwitchPage;