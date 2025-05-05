// NewsBar.jsx
import React, { useState, useEffect, useRef } from 'react';
import styles from './NewsBar.module.css';

// 範例多筆訊息
const messages = [
  { text: '新品上市！春季限量開賣', link: '#newsEvents' },
  { text: '會員專屬優惠即將結束', link: '#newsEvents' },
  { text: '寵物健康講座報名開放中', link: '#newsEvents' }
];

function NewsBar() {
  const [index, setIndex] = useState(0);
  const timeoutRef = useRef(null);
  const containerRef = useRef(null);

  // 自動翻轉
  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 4000);
    return () => clearTimeout(timeoutRef.current);
  }, [index]);

  // 點擊跳轉到 NewsEvent 區塊
  const handleClick = () => {
    const target = document.querySelector('#newsEvents');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={styles.newsBar} ref={containerRef} onClick={handleClick}>
      {messages.map((msg, i) => (
        <div
          key={i}
          className={`${styles.message} ${i === index ? styles.active : ''}`}
        >
          <span className={styles.icon}>🔔</span>
          <span>{msg.text}</span>
        </div>
      ))}
    </div>
  );
}

export default NewsBar;