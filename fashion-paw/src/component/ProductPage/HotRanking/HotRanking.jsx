// src/component/ProductPage/HotRanking/HotRanking.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './HotRanking.module.css';
// import mockRanking from './mockRanking';
import cookie from "js-cookie";

// 引入共用按鈕元件
import AddToCartBtn from '../../share/AddToCartBtn';
import AddToMyFavorite from '../../share/AddToMyFavorite';

export default function HotRanking() {
  const [ranking, setRanking] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const user_id = cookie.get('user_uid')

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get('http://localhost:8000/get/hot-ranking')
      .then(res => setRanking(res.data))
      .catch(err => {
        console.error('取得熱銷排行失敗', err);
        setError('無法取得熱銷排行');
      })
      .finally(() => setLoading(false));

    async function fetchData() {
      let favArray = await axios.get(`http://localhost:8000/select/collect/${user_id}/all`)
      setFavoriteIds(favArray.data)
    }
    fetchData()
  }, [user_id, setFavoriteIds])

  const handleToggleFavorite = id => {
    if (user_id) {

      if (favoriteIds.includes(id)) {
        //delete api
        axios.get(`http://localhost:8000/delete/collect/${user_id}/${id}`)

      }
      else {
        //insert api
        axios.get(`http://localhost:8000/insert/collect/${user_id}/${id}`)

      }

      setFavoriteIds(prev =>
        prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
      );
    }
    else {
      alert('請先登入!!!');
    }

  };

  const handleAddToCart = id => {
    alert('已加入購物車');
    console.log('HotRanking add to cart:', id);
  };

  if (loading) return <div className={styles.container}>載入中…</div>;
  if (error) return <div className={styles.container}>{error}</div>;

  return (
    <div className={styles.container}>
      <h3 className={styles.header}>熱銷排行</h3>
      <div className={styles.list}>
        {ranking.map(item => {
          const { pid, pd_name, price, imageUrl } = item;
          const isFav = favoriteIds.includes(pid);
          // 直接使用後端的完整 imageUrl，否則顯示預設圖
          const imgSrc = imageUrl || '/placeholder.png';

          return (
            <div key={pid} className={styles.card}>
              <div className={styles.imageWrapper}>
                <img src={imgSrc} alt={pd_name} className={styles.image} />
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
                      type="icon"
                      product={{ ...item,image: item.imageUrl }}
                      quantity={1}
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