import React, { Component } from 'react';
import SellerProfile from './SellerProfile';
import SellerOtherPd from './SellerOtherPd';
import SReview from './SReview';

class SellerInfo extends Component {
    state = {  } 
    render() { 
        const {review}=this.props
        return (<>
        {/* <h1>賣家合併頁</h1> */}
        <div className='paw-bg-lightenbrown my-3 py-3'>
        <SellerProfile />
        <SellerOtherPd />
        <SReview review={review}/>
        </div>
        </>);
    }
}
 
export default SellerInfo;