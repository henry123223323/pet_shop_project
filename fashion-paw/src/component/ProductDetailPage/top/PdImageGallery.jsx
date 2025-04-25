import React, { useState } from 'react';
import styles from './PdImageGallery.module.css';
const PdImageGallery = () => {
    const images = [
      '/media/second_pd/cat/cat2_home1_1.jpeg',
      '/media/second_pd/cat/cat2_home1_2.jpeg',
      '/media/second_pd/cat/cat2_home1_3.jpeg',
      '/media/second_pd/cat/cat2_home1_4.jpeg',
    ];
  
    //預設是放第一張圖
/*     const stateArray = useState(images[0]);
    const currentImage = stateArray[0];
    const setCurrentImage = stateArray[1];
 */
    const [currentImage, setCurrentImage] = useState(images[0]); // 預設第一張
  
    return (
        <>
        <h1>這是商品圖片窗</h1>
      <div className={`paw-bg-primary ${styles.imageGallery}`}>
  
        {/* 上方 */}
        <div className={styles.main}>
          <img src={currentImage} alt="展示圖" />
        </div>
  
        {/* 下方小圖 */}
        <div className={styles.small}>
          {images.map((img, index) => (
            <div
              key={index}
              className={styles.smallGallery}
              onClick={() => setCurrentImage(img)}
              style={{ cursor: 'pointer' }}
            >
              <img src={img} alt={`cat${index}`} />
            </div>
          ))}
        </div>
      </div>
      </>
    );
  };
  
  export default PdImageGallery;

