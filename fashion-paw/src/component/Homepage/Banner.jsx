// src/component/Homepage/Banner.jsx
import React from 'react'
import banner from './images/Dog9.jpg'     // 改成你自己的路徑
import styles from './Banner.module.css'

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
