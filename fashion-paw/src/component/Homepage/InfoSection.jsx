// InfoSection.jsx
import React from 'react';
import styles from './InfoSection.module.css';

// 範例資料，可替換為從 API 獲取
const knowledgeArticles = [
  { date: '2025-04-17', title: '【我是假文章', link: '/knowledge/1' },
  { date: '2025-04-10', title: '我是假文章', link: '/knowledge/2' },
  { date: '2025-03-18', title: '我是假文章', link: '/knowledge/3' },
];
const regulationArticles = [
  { date: '2025-03-05', title: '我是假相關法規', link: '/Help' },
  { date: '2025-02-26', title: '我是假相關法規', link: '/Help' },
  { date: '2025-02-19', title: '我是假相關法規', link: '/Help' },
];

function InfoSection() {
  const sortDesc = (a, b) => new Date(b.date) - new Date(a.date);
  const sortedKnowledge = [...knowledgeArticles].sort(sortDesc);
  const sortedRegulations = [...regulationArticles].sort(sortDesc);

  return (
    <div className="container-lg">
      <section className={styles.wrapper}>
        <div className="row">
          <div className="col-md-6">
            <h3 className={styles.heading}>寵物小知識</h3>
            <ul className={styles.list}>
              {sortedKnowledge.map((item, idx) => (
                <li key={idx} className={styles.item}>
                  <a href={item.link} className={styles.link}>
                    <span className={styles.date}>{item.date}</span>
                    <span className={styles.separator}>|</span>
                    <span className={styles.title}>{item.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-md-6">
            <h3 className={styles.heading}>相關法規</h3>
            <ul className={styles.list}>
              {sortedRegulations.map((item, idx) => (
                <li key={idx} className={styles.item}>
                  <a href={item.link} className={styles.link}>
                    {/* <span className={styles.date}>{item.date}</span> */}
                    <span className={styles.separator}>|</span>
                    <span className={styles.title}>{item.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

export default InfoSection;