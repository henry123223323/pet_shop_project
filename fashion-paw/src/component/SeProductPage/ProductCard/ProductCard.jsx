<<<<<<< HEAD
// src/component/ProductCard/ProductCard.jsx
import React from 'react';
import styles from './ProductCard.module.css';

// 引入 Share 底下的通用按鈕元件
import AddToCartBtn    from '../../share/AddToCartBtn';
import AddToMyFavorite from '../../share/AddToMyFavorite';

=======
import React from 'react';
import styles from './ProductCard.module.css';

>>>>>>> test
export default function ProductCard({
  id,
  name,
  price,
  imageUrl,
<<<<<<< HEAD
  isFavorite,
  onToggleFavorite,
  onAddToCart,
  viewMode
}) {
  const cls = viewMode === 'list'
    ? `${styles.card} ${styles.horizontal}`
    : styles.card;

  // 加入購物車處理：顯示 alert 並呼叫傳入的 onAddToCart
  const handleAdd = () => {
    alert('已加入購物車');
    onAddToCart(id);
  };

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
        {/* 用引入的 AddToMyFavorite 取代原生收藏按鈕 */}
        <AddToMyFavorite
          isFavorite={isFavorite}
          onClick={() => onToggleFavorite(id)}
          aria-label="切換收藏"
        />

        {/* 用引入的 AddToCartBtn 取代原生加入購物車按鈕，並彈跳提示 */}
        <AddToCartBtn
          onClick={handleAdd}
          aria-label="加入購物車"
        />
=======
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
>>>>>>> test
      </div>
    </div>
  );
}
