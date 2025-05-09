// src/component/Homepage/BestsellerTabs.jsx
import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import styles from './BestsellerTabs.module.css';
import pawicon from './images/pawicon.svg';

const tabs = [
  { key: 'pet_food', label: '飼料' },
  { key: 'Complementary_Food', label: '副食' },
  { key: 'snacks', label: '零食' },
  { key: 'Health_Supplements', label: '保健食品' },
  { key: 'Living_Essentials', label: '生活家居' },
  { key: 'toys', label: '玩具' },
];

function chunkArray(arr, size) {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

export default function BestsellerTabs() {
  // activeKey 只影響按鈕樣式，不用做資料 fetch
  const [activeKey, setActiveKey] = useState(tabs[0].key);

  // productList 存一次抓到的最熱銷完整列表
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);

  // ➡️ 只在元件載入時呼叫一次
  useEffect(() => {
    setLoading(true);
    axios
      .get('http://localhost:8000/get/hot-ranking')
      .then(res => {
        setProductList(res.data);
        setPage(0);
      })
      .catch(err => {
        console.error('載入最熱銷商品失敗', err);
        setError('載入失敗');
      })
      .finally(() => setLoading(false));
  }, []);

  // 將同一批列表，切成每頁 3 張圖
  const slides = chunkArray(productList, 3);

  const prev = () => setPage(p => (p + slides.length - 1) % slides.length);
  const next = () => setPage(p => (p + 1) % slides.length);

  return (
    <section className={styles.section}>
      <div className="container-lg">
        <h2 className={styles.title}>
          熱銷排行榜 <img src={pawicon} alt="paw" className={styles.icon} />
        </h2>

        {/* 分類按鈕：純樣式控制 */}
        <nav className={styles.tabNav}>
          {tabs.map(t => (
            <button
              key={t.key}
              className={`${styles.tab} ${t.key === activeKey ? styles.active : ''}`}
              onClick={() => {
                setActiveKey(t.key);
                setPage(0);
              }}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="container-lg">
        {loading && <div className={styles.loading}>載入中…</div>}
        {error && <div className={styles.error}>{error}</div>}

        {!loading && !error && slides.length > 0 && (
          <div className={styles.slider}>
            <button onClick={prev} className={styles.arrow}>‹</button>

            <div className={styles.viewport}>
              <div
                className={styles.track}
                style={{ transform: `translateX(-${page * 100}%)` }}
              >
                {slides.map((group, gi) => (
                  <div key={gi} className={styles.slide}>
                    {group.map(prod => (
                      <a
                             key={prod.pid}
                             href={`http://localhost:3000/product/${prod.pid}`}
                             className={styles.card}
                             target="_blank"
                             rel="noopener noreferrer"
                           >
                        <img
                          src={prod.imageUrl || '/media/default/no-image.png'}
                          alt={prod.pd_name}
                          className={styles.img}
                        />
                        <p className={styles.caption}>{prod.pd_name}</p>
                      </a>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <button onClick={next} className={styles.arrow}>›</button>
          </div>
        )}

        {!loading && !error && slides.length === 0 && (
          <div className={styles.noData}>暫無熱銷商品</div>
        )}
      </div>
    </section>
  );
}