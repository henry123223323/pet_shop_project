import React, { useState, useEffect } from 'react';
import ArticleCard from './ArticleCard';
import styles from './ArticleList.module.css';
// 這裡路徑要對到上面那個 data 資料夾
import mockData from './data/mockArticles.json';

export default function ArticleList({ topic, pet }) {
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 5;

  useEffect(() => {
    // 1. 先從 mockData 拿所有該 topic, pet 的文章
    const list = mockData[topic]?.[pet] || [];
    // 2. 依「日期」最新在前排序
    const sorted = [...list].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
    // 3. 分頁切片
    const start = (page - 1) * PAGE_SIZE;
    const slice = sorted.slice(start, start + PAGE_SIZE);
    setArticles(slice);
  }, [topic, pet, page]);


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
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          上一頁
        </button>
        <span>第 {page} 頁</span>
        <button
          disabled={articles.length < PAGE_SIZE}
          onClick={() => setPage((p) => p + 1)}
        >
          下一頁
        </button>
      </div>
    </div>
  );
}

