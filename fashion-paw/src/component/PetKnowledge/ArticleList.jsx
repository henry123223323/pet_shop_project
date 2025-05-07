import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ArticleCard from './ArticleCard';
import styles from './ArticleList.module.css';

export default function ArticleList({ topic, pet }) {
  const [articles, setArticles]     = useState([]);
  const [page, setPage]             = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const PAGE_SIZE = 5;

  useEffect(() => {
    const loadAll = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/articles');
        // 後端回完整陣列
        const fullList = res.data
          .filter(a => (!topic || a.product_category === topic))
          .filter(a => (!pet   || a.pet_type          === pet))
          .sort((a, b) => new Date(b.create_at) - new Date(a.create_at));

        const pages = Math.ceil(fullList.length / PAGE_SIZE);
        setTotalPages(pages);

        const start = (page - 1) * PAGE_SIZE;
        setArticles(fullList.slice(start, start + PAGE_SIZE));
      } catch (err) {
        console.error('取得文章失敗', err);
      }
    };
    loadAll();
  }, [topic, pet, page]);

  const toFirst = () => setPage(1);
  const toPrev  = () => setPage(p => Math.max(1, p - 1));
  const toNext  = () => setPage(p => Math.min(totalPages, p + 1));
  const toLast  = () => setPage(totalPages);

  return (
    <div className={styles.wrapper}>
      <div className={styles.cards}>
        {articles.map(a => (
          <ArticleCard key={a.ArticleID} {...a} />
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
