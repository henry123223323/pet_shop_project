import React, { Component } from 'react';
import styles from './PdImageGallery.module.css';
class PdImageGallery extends Component {
    state = {  } 
    render() { 
        return (
            <>
            <h1>這是商品圖片窗</h1>
            <div className={`paw-bg-primary ${styles.imageGallery}`}>
                <div>
                    <div > HHHHHA</div>
                    <div><img src="/fashion-paw/public/media/second_pd/cat/cat2_home1_1.jpeg" alt="" /></div>
                </div>
            </div>
            
            </>
        );
    }
}
 
export default PdImageGallery;
