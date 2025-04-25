import React, { Component } from 'react';
import styles from './pdImageGallery.module.css';

class pdImageGallery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: [
        '/media/second_pd/cat/cat2_home1_1.jpeg',
        '/media/second_pd/cat/cat2_home1_2.jpeg',
        '/media/second_pd/cat/cat2_home1_3.jpeg',
        '/media/second_pd/cat/cat2_home1_4.jpeg',
      ],
      currentImage: '/media/second_pd/cat/cat2_home1_1.jpeg',
      isZoomVisible: false,
      zoomPosition: { x: 0, y: 0 },
    };
    this.imageRef = React.createRef();
  }

  render() {
    const { image, currentImage, isZoomVisible, zoomPosition } = this.state;

    return (
      <>
        <h1>這是商品圖片窗</h1>
        <div className={styles.imageGallery}>
          {/* 大圖區 */}
          <div className={styles.main}>
            <div className="d-flex justify-content-center align-items-center">
              <i
                className="btn paw-btn-middlebrown paw-btn-outline-pri-darkbrown:hover bi bi-caret-left-fill ptxt2"
                onClick={this.leftArrowClick}
              ></i>
            </div>

            <div className={`m-2 ${styles.mainImageWrapper}`} >
              <img
                src={currentImage}
                alt="商品瀏覽圖"
                className={styles.mainImage}
                ref={this.imageRef}
                onMouseEnter={this.handleMouseEnter}
                onMouseLeave={this.handleMouseLeave}
                onMouseMove={this.handleMouseMove}
              />
             {isZoomVisible && (
  <div
    className={styles.zoomBox}
    style={{
      top: `${zoomPosition.y - 75}px`,
      left: `${zoomPosition.x - 75}px`,
      backgroundImage: `url(${currentImage})`,
      backgroundPosition: `${-zoomPosition.x * 2 + 75}px ${-zoomPosition.y * 2 + 75}px`,
    }}
  ></div>
)}
            </div>

            <div className="d-flex justify-content-center align-items-center">
              <i
                className="btn paw-btn-middlebrown paw-btn-outline-pri-darkbrown:hover bi bi-caret-right-fill ptxt2"
                onClick={this.rightArrowClick}
              ></i>
            </div>
          </div>

          {/* 小圖 */}
          <div className={styles.small}>
            {image.map((img, index) => (
              <div
                key={index}
                className={styles.smallGallery}
                onClick={() => this.handleImageClick(img)}
                style={{ cursor: 'pointer' }}
              >
                <img src={img} alt='商品圖
                '/>
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

  leftArrowClick = () => {
    const { image, currentImage } = this.state;
    const currentIndex = image.indexOf(currentImage);
    const preIndex = (currentIndex - 1 + image.length) % image.length;
    this.setState({ currentImage: image[preIndex] });
  };

  rightArrowClick = () => {
    const { image, currentImage } = this.state;
    const currentIndex = image.indexOf(currentImage);
    const nextIndex = (currentIndex + 1 + image.length) % image.length;
    this.setState({ currentImage: image[nextIndex] });
  };

  handleMouseEnter = () => {
    this.setState({ isZoomVisible: true });
  };

  handleMouseLeave = () => {
    this.setState({ isZoomVisible: false });
  };

  handleMouseMove = (e) => {
    const bounds = this.imageRef.current.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const y = e.clientY - bounds.top;
    this.setState({ zoomPosition: { x, y } });
  };
}

export default pdImageGallery;