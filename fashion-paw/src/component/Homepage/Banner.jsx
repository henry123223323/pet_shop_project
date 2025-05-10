import React from 'react'
import banner from './images/Dog9.jpg'
import styles from './Banner.module.css'


// const banners = [
//   require('./images/Dog7.jpg'),
//   require('./images/Dog9.jpg'),
//   require('./images/newsimg3.png'),
// ]

export default function Banner() {
  return (
    <div className={styles.bannerWrapper}>
      <img
        src={banner}
        alt="Banner 圖片"
        className={styles.bannerImage}
      />
      <div className={styles.bannerContent}>
        <h2>與　毛　相　遇　|　拾　獲　美　好 </h2>
        <p>Good to meet HowSmoat, pick up the beauty.</p>
      </div>
    </div>
  )
}
