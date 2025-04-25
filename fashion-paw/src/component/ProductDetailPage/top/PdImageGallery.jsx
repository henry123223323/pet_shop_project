import React, { Component } from 'react';
import styles from './pdImageGallery.module.css';

class PdImageGallery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [
        '/media/second_pd/cat/cat2_home1_1.jpeg',
        '/media/second_pd/cat/cat2_home1_2.jpeg',
        '/media/second_pd/cat/cat2_home1_3.jpeg',
        '/media/second_pd/cat/cat2_home1_4.jpeg',
      ],
      currentImage: '/media/second_pd/cat/cat2_home1_1.jpeg',
    };
  }
  
  render() {
    const { images, currentImage } = this.state;
    
    return (
      <>
        <h1>這是商品圖片窗</h1>
        <div className={`paw-bg-primary ${styles.imageGallery}`}>
          {/* 瀏覽視窗 */}
          <div className={styles.main}>
            
            <div><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-left-fill" viewBox="0 0 16 16">
  <path d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z"/>
</svg></div>
            <img src={currentImage} alt="展示圖" />
<div><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-right-fill" viewBox="0 0 16 16">
  <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"/>
</svg></div>
          </div>

          {/* 所有圖片 */}
          <div className={styles.small}>
            {images.map((img, index) => (
              <div
              key={index}
              className={styles.smallGallery}
              onClick={() => this.handleImageClick(img)}
              style={{ cursor: 'pointer' }}
              >
                <img src={img} alt={`cat${index}`} />
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }
  handleImageClick = (img) => {
    this.setState({ currentImage: img });
  };
}

export default PdImageGallery;