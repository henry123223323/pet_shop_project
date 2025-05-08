// src/component/ProductPage/HotRanking/BestsellerTabs.jsx
import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import styles from './BestsellerTabs.module.css'
import pawicon from './images/pawicon.svg'
import AddToCartBtn from '../share/AddToCartBtn'
import AddToMyFavorite from '../share/AddToMyFavorite'

const tabs = [
  { key: 'pet_food',        label: '飼料'       },
  { key: 'complementary_food', label: '副食'    },
  { key: 'snacks',          label: '零食'       },
  { key: 'Health_Supplements', label: '保健食品' },
  { key: 'Living_Essentials',  label: '生活家居' },
  { key: 'toys',            label: '玩具'       },
]

export default function BestsellerTabs({ petType = 'dog' }) {
  const [activeTab, setActiveTab] = useState(tabs[0].key)
  const [items, setItems]         = useState([])    // 後端回傳的前三名商品
  const [page, setPage]           = useState(0)
  const listRef                   = useRef(null)

  // 每次 petType 或 activeTab 變化，就去後端撈資料
  useEffect(() => {
    setPage(0)
    axios.get(`http://localhost:8000/get/hot-ranking/${petType}/${activeTab}`)
      .then(res => setItems(res.data))
      .catch(err => console.error('取得排行失敗', err))
  }, [petType, activeTab])

  // 把 items 切成每 3 張一組的 slides
  const slides = []
  for (let i = 0; i < items.length; i += 3) {
    slides.push(items.slice(i, i + 3))
  }

  const prev = () => setPage((page + slides.length - 1) % slides.length)
  const next = () => setPage((page + 1) % slides.length)

  return (
    <section className={styles.section}>
      <div className="container-lg">
        <div className={styles.titleWrapper}>
          <h2 className={styles.title}>
            熱銷排行榜
            <img src={pawicon} className={styles.icon} alt="paw" />
          </h2>
        </div>

        {/* 分類 Tab */}
        <nav className={styles.tabNav}>
          {tabs.map(tab => (
            <button
              key={tab.key}
              className={`${styles.tab} ${tab.key === activeTab ? styles.active : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Carousel */}
      <div className="container-lg">
        <div className={styles.slider}>
          <button onClick={prev} className={styles.arrow}>‹</button>
          <div className={styles.viewport}>
            <div
              className={styles.track}
              style={{ transform: `translateX(-${page * 100}%)` }}
            >
              {slides.map((group, gi) => (
                <div key={gi} className={styles.slide}>
                  {group.map(item => (
                    <div key={item.pid} className={styles.card}>
                      <div className={styles.imageWrapper}>
                        <img
                          src={item.imageUrl || '/placeholder.png'}
                          alt={item.pd_name}
                          className={styles.img}
                        />
                      </div>
                      <p className={styles.name}>{item.pd_name}</p>
                      <p className={styles.price}>
                        NT$ {Number(item.price).toLocaleString()}
                      </p>
                      <div className={styles.actions}>
                        <AddToMyFavorite isFavorite={false} onClick={()=>{}} size="20px" />
                        <AddToCartBtn onClick={()=>{}} />
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <button onClick={next} className={styles.arrow}>›</button>
        </div>
      </div>
    </section>
  )
}
