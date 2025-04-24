// src/component/HotRanking/HotRanking.jsx
import React from 'react';
import styles from './HotRanking.module.css';
import mockRanking from './mockRanking';

export default function HotRanking() {
  return (
    <div className={styles.container}>
      <h3 className={styles.header}>🔥 熱銷排行</h3>
      <div className={styles.list}>
        {mockRanking.map(item => (
          <div key={item.id} className={styles.card}>
            <div className={styles.imageWrapper}>
              <img
                src={item.imageUrl}
                alt={item.name}
                className={styles.image}
              />
            </div>
            <p className={styles.name}>{item.name}</p>
            <div className={styles.actions}>
              <button className={styles.btn} aria-label="收藏">
                🤍
              </button>
              <button className={styles.btn} aria-label="加入購物車">
               🛒
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
