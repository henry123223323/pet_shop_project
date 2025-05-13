// src/component/ProductCard/ProductCard.jsx
import React from 'react';
import styles from './ProductCard.module.css';

// 引入 Share 底下的通用按鈕元件
import AddToCartBtn from '../../share/AddToCartBtn';
import AddToMyFavorite from '../../share/AddToMyFavorite';

export default function ProductCard({
  id,
  uid,
  name,
  price,
  images,
  isFavorite,
  onToggleFavorite,
  onAddToCart,
  viewMode
}) {
  
  const cls = viewMode === 'list'
    ? `${styles.card} ${styles.horizontal}`
    : styles.card;

  // 加入購物車處理：顯示 alert 並呼叫傳入的 onAddToCart（佳宜修過不用這個了）
  // const handleAdd = () => {
  //   alert('已加入購物車');
  //   onAddToCart(id);
  // };

  const product = {
    pid: id,
    pd_name: name,
    price,
    image: images?.[0]?.img_path ,
    condition: "second", 
    uid: String(uid), 
  };
  return (
    <div className={cls} >
      <div className={styles.imageWrapper}>
        <img src={images[0].img_path} alt={name} />
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
                      type="icon"
                      product={product}
                      quantity={1}
                      aria-label="加入購物車"
                    />
      </div>
    </div>
  );
}
