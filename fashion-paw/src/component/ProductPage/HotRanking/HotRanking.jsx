// src/component/ProductPage/HotRanking/HotRanking.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import cookie from 'js-cookie';
import styles from './HotRanking.module.css';

// 共用按鈕元件
import AddToCartBtn from '../../share/AddToCartBtn';
import AddToMyFavorite from '../../share/AddToMyFavorite';

export default function HotRanking() {
  const [ranking, setRanking] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const user_id = cookie.get('user_uid');

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

    async function fetchFavorites() {
      if (user_id) {
        const res = await axios.get(
          `http://localhost:8000/select/collect/${user_id}/all`
        );
        setFavoriteIds(res.data);
      }
    }
    fetchFavorites();
  }, [user_id]);

  const handleToggleFavorite = pid => {
    if (!user_id) {
      return alert('請先登入!!!');
    }

    const api = favoriteIds.includes(pid)
      ? `/delete/collect/${user_id}/${pid}`
      : `/insert/collect/${user_id}/${pid}`;

    axios.get(`http://localhost:8000${api}`);
    setFavoriteIds(prev =>
      prev.includes(pid) ? prev.filter(x => x !== pid) : [...prev, pid]
    );
  };

  const handleAddToCart = pid => {
    alert('已加入購物車');
    console.log('HotRanking add to cart:', pid);
  };

  if (loading) return <div className={styles.container}>載入中…</div>;
  if (error) return <div className={styles.container}>{error}</div>;

  return (
    <div className={styles.container}>
      <h3 className={styles.header}>熱銷排行🔥</h3>
      <div className={styles.list}>
        {ranking.map(item => {
          const { pid, pd_name, price, imageUrl } = item;
          const isFav = favoriteIds.includes(pid);
          const imgSrc = imageUrl || '/placeholder.png';

          return (
            <div key={pid} className={styles.card}>
              <div className={styles.imageWrapper}>
                <Link to={`/product/${pid}`}>
                  <img
                    src={imgSrc}
                    alt={pd_name}
                    className={styles.image}
                  />
                </Link>
              </div>

              <p className={styles.name}>{pd_name}</p>
              <p className={styles.price}>
                NT${Number(price).toLocaleString()}
              </p>

              <div className={styles.actions}>
                <AddToMyFavorite
                  isFavorite={isFav}
                  onClick={() => handleToggleFavorite(pid)}
                  size="20px"
                  aria-label="收藏"
                />
                <AddToCartBtn
                  type="icon"
                  product={{ ...item, image: imageUrl }}
                  quantity={1}
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
