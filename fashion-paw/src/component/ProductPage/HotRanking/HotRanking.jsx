// src/component/ProductPage/HotRanking/HotRanking.jsx
import React, { useState } from 'react';
import styles from './HotRanking.module.css';
import mockRanking from './mockRanking';

export default function HotRanking() {
  const [favoriteIds, setFavoriteIds] = useState([]);

  const handleToggleFavorite = id => {
    setFavoriteIds(prev =>
      prev.includes(id)
        ? prev.filter(favId => favId !== id)
        : [...prev, id]
    );
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.header}>熱銷排行</h3>
      <div className={styles.list}>
        {mockRanking.map(item => {
          const isFavorite = favoriteIds.includes(item.id);
          return (
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
                <button
                  className={`${styles.btn} ${isFavorite ? styles.favorited : ''}`}
                  aria-label="收藏"
                  onClick={() => handleToggleFavorite(item.id)}
                >
                  {isFavorite ? '❤️' : '🤍'}
                </button>
                <button
                  className={styles.btn}
                  aria-label="加入購物車"
                  onClick={() => alert('已加入購物車')}
                >
                  🛒
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
