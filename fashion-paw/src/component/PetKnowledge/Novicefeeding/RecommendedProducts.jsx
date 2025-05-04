import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './RecommendedProducts.module.css';
import AddToCartBtn from '../../share/AddToCartBtn';

export default function RecommendedProducts() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8000/get/recommend-products')
      .then(res => setItems(res.data))
      .catch(err => {
        console.error('取得推薦商品失敗', err);
        setError('無法取得推薦商品');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>載入中…</div>;
  if (error)   return <div className="text-danger">{error}</div>;

  return (
    <div className={styles.container}>
      <h5>或許你適合…</h5>
      <div className={styles.list}>
        {items.map(item => (
          <div key={item.pid} className={styles.card}>
            {item.imageUrl
              ? <img src={item.imageUrl} alt={item.name} className={styles.image}/>
              : <div className={styles.noImage}>暫無圖片</div>}
            <div className={styles.info}>
              <p>商品名稱：{item.name}</p>
              <p>價格：{item.price} 元</p>
            </div>
            <div className={styles.btnContainer}>
           <AddToCartBtn onClick={() => console.log('加入購物車', item.pid)} />
          </div>
          </div>
        ))}
      </div>
    </div>
  );
}
