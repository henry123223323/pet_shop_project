import React from 'react';
import styles from './ProductCard.module.css';

export default function ProductCard({
  id,
  name,
  price,
  imageUrl,
  isFavorite = false,
  onToggleFavorite = () => {},
  onAddToCart = () => {},
  
}) {
  return (
    <div className={styles.card} data-id={id}>
      <div className={styles.imageWrapper}>
        <img src={imageUrl} alt={name} />
      </div>

      <div className={styles.content}>
        <div className={styles.info}>
          <h4 className={styles.title}>{name}</h4>
          <p className={styles.price}>NT${price}</p>
          <p className={styles.desc}> </p>
        </div>

        <div className={styles.actions}>
          <button
            className={`${styles.btn} ${isFavorite ? styles.favorited : ''}`}
            onClick={() => onToggleFavorite(id)}
            aria-label="收藏"
          >
            {isFavorite ? '❤️' : '🤍'}
          </button>
          <button
            className={styles.btn}
            onClick={() => {
              alert('已加入購物車');
              onAddToCart(id);
            }}
            aria-label="加入購物車"
          >
            🛒
          </button>
        </div>
      </div>
    </div>
  );
}
