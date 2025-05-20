import React, { useState, useEffect } from 'react'
import axios from 'axios'
import styles from './BestsellerTabs.module.css'
import pawicon from './images/pawicon.svg'
const API_BASE = 'http://localhost:8000'

// 對應後端返回的 product_category
const tabs = [
  { key: 'pet_food',           label: '飼料' },
  { key: 'complementary_food',  label: '副食' },
  { key: 'snacks',              label: '零食' },
  { key: 'Health_Supplements',  label: '保健食品' },
  { key: 'Living_Essentials',   label: '生活家居' },
  { key: 'toys',                label: '玩具' }
]

function chunkArray(arr, size) {
  const chunks = []
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size))
  }
  return chunks
}

export default function BestsellerTabs() {
  const [activeKey, setActiveKey] = useState(tabs[0].key)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(0)

  // 初次載入或 activeKey 改變時，一次拿全部分類前5
  useEffect(() => {
  setLoading(true)
  axios.get(`${API_BASE}/get/category-ranking`)
    .then(res => {
      console.log('▶️ category-ranking raw data:', res.data)
      setData(res.data)
      setPage(0)
      })
      .catch(err => {
        console.error('載入分類排行失敗', err)
        setError(err.response?.data || err.message || '載入失敗')
      })
      .finally(() => setLoading(false))
  }, [])

  // 選擇對應分類的商品
  const currentList = data.filter(item => item.category === activeKey)
  const slides = chunkArray(currentList, 3)
  const prev = () => setPage(p => (p + slides.length - 1) % slides.length)
  const next = () => setPage(p => (p + 1) % slides.length)

  return (
    <section className={styles.section}>
      <div className="container-lg">
        <h2 className={styles.title}>
          熱銷排行榜 <img src={pawicon} alt="paw" className={styles.icon} />
        </h2>
        <nav className={styles.tabNav}>
          {tabs.map(t => (
            <button
              key={t.key}
              className={`${styles.tab} ${t.key === activeKey ? styles.active : ''}`}
              onClick={() => { setActiveKey(t.key); setPage(0) }}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="container-lg">
        {loading && <div className={styles.loading}>載入中…</div>}
        {error   && <div className={styles.error}>{error}</div>}

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
                        href={`/product/${prod.pid}`}
                        className={styles.card}
                      >
                        <img
                          src={prod.imageUrl || '/media/default/no-image.png'}
                          alt={prod.name}
                          className={styles.img}
                        />
                        <p className={styles.caption}>{prod.name}</p>
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
          <div className={styles.noData}>暫無資料</div>
        )}
      </div>
    </section>
  )
}
