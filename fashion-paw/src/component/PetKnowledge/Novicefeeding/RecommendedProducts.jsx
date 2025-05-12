import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './RecommendedProducts.module.css';
import AddToCartBtn from '../../share/AddToCartBtn';
import AddToMyFavorite from '../../share/AddToMyFavorite';
import cookie from 'js-cookie';

export default function RecommendedProducts({ pet_type }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorID, setFavorID] = useState([]);
  const user_id = cookie.get('user_uid');

  useEffect(() => {
        setLoading(true);
    setError(null);

    console.log('🔍 使用寵物類型參數 pet_type =', pet_type);
    // 組建 URL：即使沒有 pet_type，也取全部推薦
    let url = 'http://localhost:8000/get/recommend-products';
    if (pet_type) url += `?pet_type=${pet_type}`;
    console.log('🔍 呼叫推薦 API URL =', url);

    axios.get(url)
      .then(res => setItems(res.data))
      .catch(err => {
        console.error('取得推薦商品失敗', err);
        setError('無法取得推薦商品');
      })
      .finally(() => setLoading(false));

    axios.get(`http://localhost:8000/select/collect/${user_id}/all`)
      .then(res => setFavorID(res.data))
      .catch(err => {
        console.error('取得收藏狀態失敗', err);
        setError('取得收藏狀態失敗');
      });
  }, [pet_type, user_id]);

  if (loading) return <div>載入中…</div>;
  if (error)   return <div className="text-danger">{error}</div>;

  // 處理收藏狀態
  const Change_FavorState = pid => {
    if (!user_id) return alert('請先登入');
    const urlBase = 'http://localhost:8000';
    if (favorID.includes(pid)) {
      axios.get(`${urlBase}/delete/collect/${user_id}/${pid}`)
        .then(() => setFavorID(prev => prev.filter(id => id !== pid)));
    } else {
      axios.get(`${urlBase}/insert/collect/${user_id}/${pid}`)
        .then(() => setFavorID(prev => [...prev, pid]));
    }
  };


  return (
    <div className={styles.container}>
      <h5>或許你適合…</h5>
      <div className={styles.list}>
        {items.map(item => (
          <div key={item.pid} className={styles.card}>
            {item.imageUrl
              ? <img src={item.imageUrl} alt={item.name} className={styles.image} />
              : <div className={styles.noImage}>暫無圖片</div>}
            <div className={styles.info}>
              <p>商品名稱：{item.name}</p>
              <p>價格：{item.price} 元</p>
            </div>
            <div className={styles.btnContainer}>
              <AddToMyFavorite
                type='text'
                isFavorite={favorID.includes(item.pid)}
                onClick={() => Change_FavorState(item.pid)}
              />
              <AddToCartBtn
                type="icon"
                product={{ ...item, image: item.imageUrl }}
                quantity={1}
                aria-label="加入購物車"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
