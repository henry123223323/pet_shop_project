import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './HotRanking.module.css';
import AddToCartBtn from '../../share/AddToCartBtn';
import AddToMyFavorite from '../../share/AddToMyFavorite';

// axios 根網址，可透過 REACT_APP_API_URL 設定或採用相對路徑
axios.defaults.baseURL = process.env.REACT_APP_API_URL || '';

export default function HotRanking() {
  const [ranking, setRanking] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get('/get/hot-ranking')
      .then(res => setRanking(res.data))
      .catch(err => {
        console.error('取得熱銷排行失敗', err);
        setError('無法取得熱銷排行');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleToggleFavorite = id => {
    setFavoriteIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleAddToCart = id => {
    alert('已加入購物車');
    console.log('HotRanking add to cart:', id);
  };

  if (loading) return <div className={styles.container}>載入中…</div>;
  if (error)   return <div className={styles.container}>{error}</div>;

  // public 資料夾根路徑中的預設圖
  const placeholderUrl = `${process.env.PUBLIC_URL}/placeholder.png`;

  return (
    <div className={styles.container}>
      <h3 className={styles.header}>熱銷排行</h3>
      <div className={styles.list}>
        {ranking.map(item => {
          const { pid, pd_name, price, imageUrl } = item;
          const isFav = favoriteIds.includes(pid);
          // 處理 imageUrl：若含 http|https|// 則直接用；否則以 baseURL 拼接
          const imgSrc = imageUrl
            ? /^(https?:)?\/\//.test(imageUrl)
              ? imageUrl
              : `${axios.defaults.baseURL}/${imageUrl}`
            : placeholderUrl;

          return (
            <div key={pid} className={styles.card}>
              <div className={styles.imageWrapper}>
                <img
                  src={imgSrc}
                  alt={pd_name}
                  className={styles.image}
                  onError={e => { e.currentTarget.src = placeholderUrl; }}
                />
              </div>
              <p className={styles.name}>{pd_name}</p>
              <p className={styles.price}>
                價格：{Number(price).toLocaleString('zh-TW', {
                  style: 'currency',
                  currency: 'TWD',
                })}
              </p>
              <div className={styles.actions}>
                <AddToMyFavorite
                  isFavorite={isFav}
                  onClick={() => handleToggleFavorite(pid)}
                  size="24px"
                  aria-label="收藏"
                />
                <AddToCartBtn
                  onClick={() => handleAddToCart(pid)}
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
