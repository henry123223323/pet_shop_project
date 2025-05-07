import React, { useState, useEffect } from 'react';
import ArticleCard from './ArticleCard';
import styles from './ArticleList.module.css';
// 這裡路徑要對到上面那個 data 資料夾
import mockData from './data/mockArticles.json';

export default function ArticleList({ topic, pet }) {
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 5;

  // 先取出該 topic＋pet 的完整清單，並算總頁
  const fullList = mockData[topic]?.[pet] || []
  const totalPages = Math.ceil(fullList.length / PAGE_SIZE)

  useEffect(() => {
    // 排序＋分頁
    const sorted = [...fullList].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    )
    const start = (page - 1) * PAGE_SIZE
    setArticles(sorted.slice(start, start + PAGE_SIZE))
  }, [topic, pet, page])

  const toFirst = () => setPage(1)
  const toPrev  = () => setPage(p => Math.max(1, p - 1))
  const toNext  = () => setPage(p => Math.min(totalPages, p + 1))
  const toLast  = () => setPage(totalPages)


  return (
    <div className={styles.wrapper}>
      <div className={styles.cards}>
        {articles.map(a => (
          <ArticleCard
            key={a.id}
            {...a}
            topic={topic}
            pet={pet}
          />
        ))}
      </div>
      <div className={styles.pagination}>
      <div className={styles.buttons}>
          <button onClick={toFirst} disabled={page === 1}>«</button>
          <button onClick={toPrev}  disabled={page === 1}>‹</button>
  
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
            <button
              key={n}
              className={n === page ? styles.active : ''}
              onClick={() => setPage(n)}
            >
              {n}
            </button>
          ))}
  
          <button onClick={toNext} disabled={page === totalPages}>›</button>
          <button onClick={toLast} disabled={page === totalPages}>»</button>
        </div>
        <div className={styles.pageInfo}>
          第 {page} 頁 ｜ 共 {totalPages} 頁
        </div>
      </div>
    </div>
  );
}

