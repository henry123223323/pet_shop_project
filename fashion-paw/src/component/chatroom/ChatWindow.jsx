import React, { useState } from 'react';
import styles from './ChatWindow.module.css';

export default function ChatWindow() {
  const [messages, setMessages] = useState([
    { id: 1, from: 'bot', text: '主人好！歡迎來好拾毛看本汪汪嘍╭∩╮', time: '09:20' },
    { id: 2, from: 'bot', text: '有任何問題歡迎詢問本汪！為了主人本汪會全力以赴(如果我會的話汪)!!', time: '09:20' },
    { id: 3, from: 'bot', text: '嗨(好)嗨(的)～本週熱門商品如下：', time: '09:22' },
    // ... 可以再加上使用者訊息 { from: 'user', text: '…', time: '…' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg = {
      id: Date.now(),
      from: 'user',
      text: input.trim(),
      time: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
  };

  return (
    <div className={styles.chatContainer}>
      {/* 2. 標題區 */}
      <header className={styles.header}>
        <div className={styles.info}>
          <h2>好拾汪</h2>
          <p>官網客服｜上次上線時間：使命必達汪汪時間</p>
        </div>
      </header>

      {/* 4. 訊息列表 */}
      <div className={styles.messages}>
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`${styles.message} ${msg.from === 'bot' ? styles.bot : styles.user}`}
          >
            <span className={styles.text}>{msg.text}</span>
            <span className={styles.time}>{msg.time}</span>
          </div>
        ))}
      </div>

      {/* 6. 輸入區 */}
      <div className={styles.inputArea}>
        <button className={styles.button}><i className="bi bi-plus-lg"></i></button>
        <input
          className={styles.input}
          type="text"
          placeholder="輸入訊息…"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
        />
        <button className={styles.button}><i className="bi bi-emoji-smile"></i></button>
        <button className={styles.send} onClick={handleSend}>
          <i className="bi bi-paw-fill"></i>
        </button>
      </div>
    </div>
  );
}
