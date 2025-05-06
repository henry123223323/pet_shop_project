import React, { useState } from 'react'
import styles from './BestsellerTabs.module.css'
import pawicon from './images/pawicon.svg'
import Dog7 from './images/Dog7.jpg'
import Dog9 from './images/Dog9.jpg'
import Dog from './images/5-3littlemonster_chicken.png'
import Dog2 from './images/3-2Rrannk_beef.png'
import Cat from './images/4-2kitcat_tunacrab.png'
import Cat2 from './images/5-1Instinct_duck.png'
import Cat3 from './images/6-2sheba_tunachicken.png'


const categories = [
  {
    key: 'feed',
    label: '飼料',
    images: [Dog7, Dog9, Dog7, Dog9, Dog7, Dog9],
  },
  {
    key: 'ComplementaryFood',
    label: '副食',
    images: [Dog, Dog2, Cat, Cat2, Cat3],
  },
  {
    key: 'snack',
    label: '零食',
    images: [Dog7, Dog9, Dog7],
  },
  {
    key: 'health',
    label: '保健食品',
    images: [Dog9, Dog7, Dog9],
  },
  {
    key: 'home',
    label: '生活家居',
    images: [Dog7, Dog9, Dog7],
  },
  {
    key: 'toy',
    label: '玩具',
    images: [Dog9, Dog7, Dog9],
  },
]


function chunkArray(arr, size) {
  const chunks = []
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size))
  }
  return chunks
}

export default function BestsellerTabs() {

  const [activeKey, setActiveKey] = useState(categories[0].key)
  const activeCategory = categories.find((c) => c.key === activeKey)

  const slides = chunkArray(activeCategory.images, 3)

  const [page, setPage] = useState(0)

  const prev = () => setPage((page + slides.length - 1) % slides.length)
  const next = () => setPage((page + 1) % slides.length)


  const switchCategory = (key) => {
    setActiveKey(key)
    setPage(0)
  }

  return (
    <section className={styles.section}>
      <div className="container-lg">
        <div className={styles.titleWrapper}>
          <h2 className={styles.title}>
            熱銷排行榜
            <img src={pawicon} className={styles.icon} />
          </h2>
        </div>


        <nav className={styles.tabNav}>
          {categories.map((cat) => (
            <button
              key={cat.key}
              className={`${styles.tab} ${cat.key === activeKey ? styles.active : ''
                }`}
              onClick={() => switchCategory(cat.key)}
            >
              {cat.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="container-lg">
        <div className={styles.slider}>
          <button onClick={prev} className={styles.arrow}>
            ‹
          </button>

          <div className={styles.viewport}>
            <div
              className={styles.track}
              style={{ transform: `translateX(-${page * 100}%)` }}
            >
              {slides.map((group, gi) => (
                <div key={gi} className={styles.slide}>
                  {group.map((src, idx) => (
                    <div key={idx} className={styles.card}>
                      <img src={src} className={styles.img} alt="" />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <button onClick={next} className={styles.arrow}>
            ›
          </button>
        </div>
      </div>
    </section>
  )
}
