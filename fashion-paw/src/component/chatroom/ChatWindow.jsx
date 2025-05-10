import React, { useState } from 'react';
import styles from './ChatWindow.module.css';
import userAvatar from './user.png';
import botAvatar  from './dog.png';

export default function ChatApp() {
  // 1. 使用者清單
  const users = [
    { id: 'u1', name: '毛毛主人', avatar: userAvatar, lastTime: '今天 10:22', snippet: '好的，因為是二手商品所…' },
    { id: 'u2', name: '好拾啾',   avatar: userAvatar, lastTime: '昨天 09:20', snippet: '感謝主人在好拾毛成功完成購…' },
    { id: 'u3', name: '好拾汪',   avatar: userAvatar, lastTime: '前天 09:20', snippet: '嗨(好)嗨(的)～本週熱門商…' },
  ];

  // 2. selected user
  const [selected, setSelected] = useState(users[0]);

  // 3. 把訊息依 user.id 分開
  const [messagesMap, setMessagesMap] = useState({
    u1: [
      { id: 1, from: 'bot', text: '好的，因為是二手商品所以不關我的事哦，汪!', time: '10:20' },
    ],
    u2: [
      { id: 1, from: 'bot', text: '感謝主人在好拾毛成功完成購買! 商品很快就會送達汪!', time: '09:20' },
    ],
    u3: [
      { id: 1, from: 'bot', text: '嗨(好)嗨(的)～本週熱門商品如下:', time: '09:20' },
    ],
  });

  // 4. 當下顯示的訊息
  const messages = messagesMap[selected.id] || [];

  const [input, setInput] = useState('');

  // 5. 送出訊息要更新對應那位使用者的陣列
  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg = {
      id: Date.now(),
      from: 'user',
      text: input.trim(),
      time: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })
    };
    setMessagesMap(prev => ({
      ...prev,
      [selected.id]: [...(prev[selected.id]||[]), newMsg]
    }));
    setInput('');
  };

  return (
    <div className={styles.container}>
      {/* 左側 Sidebar */}
      <aside className={styles.sidebar}>
        <header className={styles.sidebarHeader}>
          <img src={selected.avatar} alt={selected.name} className={styles.avatar} />
          <div>
            <p className={styles.name}>{selected.name}</p>
            <p className={styles.sub}>上次上線時間：{selected.lastTime}</p>
          </div>
        </header>
        <ul className={styles.userList}>
          {users.map(u => (
            <li
              key={u.id}
              className={`${styles.userItem} ${u.id===selected.id?styles.active:''}`}
              onClick={()=>setSelected(u)}
            >
              <img src={u.avatar} alt={u.name} className={styles.avatarSm} />
              <div className={styles.meta}>
                <p className={styles.nameSm}>{u.name}</p>
                <p className={styles.subSm}>{u.snippet}</p>
              </div>
            </li>
          ))}
        </ul>
      </aside>

      {/* 右側 ChatWindow */}
      <main className={styles.chatWindow}>
        <header className={styles.header}>
          <img src={botAvatar} alt="客服汪" className={styles.avatar} />
          <div>
            <p className={styles.name}>好拾汪</p>
            <p className={styles.sub}>官網客服｜上次上線時間：使命必達汪汪時間</p>
          </div>
        </header>

        <div className={styles.messages}>
          <div className={styles.dateSep}>前天</div>
          {messages.map(m=>(
            <div key={m.id} className={`${styles.message} ${m.from==='bot'?styles.bot:styles.user}`}>
              <span className={styles.text}>{m.text}</span>
              <span className={styles.time}>{m.time}</span>
            </div>
          ))}
        </div>

        <div className={styles.quickBtns}>
          <button>熱門商品TOP3</button>
          <button>拾毛活動</button>
        </div>

        <div className={styles.inputArea}>
          <button className={styles.btn}>＋</button>
          <button className={styles.btn}>😊</button>
          <input
            className={styles.input}
            value={input}
            onChange={e=>setInput(e.target.value)}
            onKeyDown={e=>e.key==='Enter'&&handleSend()}
            placeholder="輸入訊息…"
          />
          <button className={styles.send} onClick={handleSend}>🐾</button>
        </div>
      </main>
    </div>
  );
}
