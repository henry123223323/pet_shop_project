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
            <span></span>
            <img src={currentImage} alt="展示圖" />
            <span></span>
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