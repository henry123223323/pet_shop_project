// src/component/ProductCard/ProductCard.jsx
import React from 'react';
import styles from './ProductCard.module.css';
import { FaHeart, FaShoppingCart } from 'react-icons/fa'; // 你也可換成其他圖示庫

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
      <img src={imageUrl} alt={name} className={styles.img} />
      <h2 className={styles.title}>{name}</h2>
      <p className={styles.price}>NT${price}</p>

      <div className={styles.actions}>
        {/* 收藏按鈕 */}
        <button
          className={`${styles.btn} ${isFavorite ? styles.favorited : ''}`}
          onClick={() => onToggleFavorite(id)}
          aria-label="收藏"
        >
          <FaHeart />
        </button>

        {/* 加入購物車按鈕 */}
        <button
          className={styles.btn}
          onClick={() => onAddToCart(id)}
          aria-label="加入購物車"
        >
          <FaShoppingCart />
        </button>
      </div>
    </div>
  );
}
