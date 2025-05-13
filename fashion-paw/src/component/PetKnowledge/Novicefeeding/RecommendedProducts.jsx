import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './RecommendedProducts.module.css';
import AddToCartBtn from '../../share/AddToCartBtn';
import AddToMyFavorite from 'component/share/AddToMyFavorite';
import cookie from 'js-cookie';

export default function RecommendedProducts() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorID, setFavorID] = useState([])
  const user_id = cookie.get('user_uid')

  useEffect(() => {
    axios.get('http://localhost:8000/get/recommend-products')
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
      })
      .finally(() => setLoading(false));
  }, [user_id]);

  if (loading) return <div>載入中…</div>;
  if (error) return <div className="text-danger">{error}</div>;


  const Change_FavorState = (pid) => {
    if (user_id) {
      if (favorID.includes(pid)) {
        axios.get(`http://localhost:8000/delete/collect/${user_id}/${pid}`)
        setFavorID(prev => prev.filter(id => id !== pid));

      }
      else {
        axios.get(`http://localhost:8000/insert/collect/${user_id}/${pid}`)

        setFavorID(prev => [...prev, pid]);
      }

    }
    else {
      alert('請先登入')
    }




  }
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
              <AddToMyFavorite type='text' isFavorite={favorID.includes(item.pid)} onClick={() => Change_FavorState(item.pid)} />
              <AddToCartBtn
                      type="icon"
                      product={{
                        ...item,
                        pd_name: item.name,
                        images: [{ img_path: item.imageUrl }], // 給 normalizeCartItem 用
                        unit_price: parseInt(item.price || 0, 10), // 保底
                      }}
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
