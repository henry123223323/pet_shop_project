// src/component/ProductPage/HotRanking/HotRanking.jsx
import React, { useState, useEffect } from 'react';
import styles from './HotRanking.module.css';
import mockRanking from './mockRanking';

// 引入共用按鈕元件
import AddToCartBtn from '../../share/AddToCartBtn';
import AddToMyFavorite from '../../share/AddToMyFavorite';

export default function HotRanking({ value = '', onChange = () => {} }) {
  const [favoriteIds, setFavoriteIds] = useState([]);

  useEffect(() => {
    setFavoriteIds([]);
  }, [value]);

  const handleToggleFavorite = id => {
    setFavoriteIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleAddToCart = id => {
    alert('已加入購物車');
    console.log('HotRanking add to cart:', id);
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.header}>熱銷排行</h3>
      <div className={styles.list}>
        {mockRanking.map(item => {
          const isFav = favoriteIds.includes(item.id);
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
                {/* 使用 AddToMyFavorite，傳入 isFavorite 及 onClick */}
                <AddToMyFavorite
                  isFavorite={isFav}
                  onClick={() => handleToggleFavorite(item.id)}
                  size="24px"
                  aria-label="收藏"
                />

                {/* 使用 AddToCartBtn */}
                <AddToCartBtn
                  onClick={() => handleAddToCart(item.id)}
                  aria-label="加入購物車"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
