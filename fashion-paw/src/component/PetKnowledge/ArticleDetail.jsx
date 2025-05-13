// src/component/PetKnowledge/ArticleDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from './SideBar';
import styles from './ArticleDetail.module.css';
import axios from 'axios';
import RecommendedProducts from './Novicefeeding/RecommendedProducts';  // ← 引入推薦商品

export default function ArticleDetail({ topic }) {
  const { pet, id } = useParams();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    axios.get(`/api/petknowarticle/${id}`)
      .then(res => setArticle(res.data))
      .catch(console.error);
  }, [id]);

  if (!article) return <div className={styles.loading}>載入中…</div>;

  let sections = [];
  try { sections = JSON.parse(article.sections); }
  catch { }

  return (
    <div className={styles.container}>
      {/* 側邊欄 */}
      <Sidebar topic={topic} selected={pet} />

      {/* 內文主區 */}
      <div className={styles.detailWrapper}>
        {article.bannerUrl && (
          <img src={article.bannerUrl}
            alt={article.title}
            className={styles.mainImage} />
        )}

        <div className={styles.header}>
          <h1 className={styles.title}>{article.title}</h1>
          <div className={styles.meta}>
            <span className={styles.date}>
              {new Date(article.date).toLocaleDateString()}
            </span>
            <span className={styles.type}>
              {article.articleType === 'pet_feeding'
                ? '新手飼養'
                : '健康檢查'}
            </span>
          </div>
        </div>

        <p className={styles.summary}>{article.summary}</p>

        <div className={styles.sections}>
          {sections.map((sec, i) => (
            <section key={i} className={styles.section}>
              {sec.heading &&
                <h2 className={styles.secHeading}>{sec.heading}</h2>}
              <p className={styles.secBody}>{sec.body}</p>
            </section>
          ))}
        </div>

        {/* ← 在這裡插入推薦商品元件 */}
        <RecommendedProducts
          pet_type={article.pet}
          product_category={article.category}
        />
      </div>
    </div>
  );
}
