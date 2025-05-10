// NewsBar.jsx
import React, { useState, useEffect, useRef } from 'react';
import styles from './NewsBar.module.css';

// 範例多筆訊息
const messages = [
  { text: '結帳金額滿399免運費', link: '#newsEvents' },
  { text: '貓砂買二送一', link: '#newsEvents' },
  { text: '全館玩具8折', link: '#newsEvents' },
  { text: '新會員註冊送100元折價券', link: '#newsEvents' },
  { text: '保健食品買三送一', link: '#newsEvents' },
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