// src/component/ProductCard/ProductCard.jsx
import React from 'react';
import styles from './ProductCard.module.css';

export default function ProductCard({
  id, name, price, imageUrl,
  isFavorite, onToggleFavorite, onAddToCart,
  viewMode
}) {
  // 如果是 list 模式，就加上 .horizontal
  const cls = viewMode === 'list'
    ? `${styles.card} ${styles.horizontal}`
    : styles.card;

  return (
    <div className={cls}>
      <div className={styles.imageWrapper}>
        <img src={imageUrl} alt={name} />
      </div>
      <div className={styles.content}>
        <h3 className={styles.name}>{name}</h3>
        <p className={styles.price}>NT${price}</p>
      </div>
      <div className={styles.actions}>
        <button
          onClick={() => onToggleFavorite(id)}
          className={isFavorite ? styles.favorited : ''}
          aria-label="切換收藏"
        >
          🤍
        </button>
        <button
          onClick={() => onAddToCart(id)}
          aria-label="加入購物車"
        >
          🛒
        </button>
      </div>
    </div>
  );
}
