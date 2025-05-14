import React, { useState, useRef, useEffect } from 'react';
import styles from './ChatWindow.module.css';
import userAvatar from './user.png';
import botAvatar from './dog.png';
import cookie from 'js-cookie';
import axios from 'axios';

export default function ChatApp() {
  const user_id = cookie.get('user_uid')
  const [users, setusers] = useState(
    [//api多uid欄位
      { id: 'u3', name: '好拾汪', avatar: userAvatar, lastTime: '前天 09:20', snippet: '嗨(好)嗨(的)～本週熱門商…' },
      { id: 'u2', name: '好拾啾', avatar: userAvatar, lastTime: '昨天 09:20', snippet: '感謝主人在好拾毛成功完成購…' },
      { id: 'u1', name: '毛毛主人', avatar: userAvatar, lastTime: '今天 10:22', snippet: '好的，因為是二手商品所…' },
    ]
  )
  // 1. 使用者清單
  const messagesEndRef = useRef(null);

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
      { id: 1, from: 'bot', text: '我是AI客服機器人,你需要甚麼幫忙嗎?', time: '09:20' },
    ],
  });

  // 4. 當下顯示的訊息
  const messages = messagesMap[selected.id] || [];

  const [input, setInput] = useState('');
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    console.log(messages);

  }, [messages]);

  useEffect(() => {
    axios.get(`http://localhost:8000/channel/${user_id}`)
      .then(res => {
        console.log(res.data);
        setusers(res.data)
      })

    axios.get(`http://localhost:8000/message/${user_id}`)
      .then(msg => {
        console.log(msg.data);
        setMessagesMap(msg.data);

      })
  }, [])

  // 5. 送出訊息要更新對應那位使用者的陣列
  const handleSend = () => {
    if (!input.trim()) return;//輸入為空
    const newMsg = {
      id: user_id,
      from: 'user',
      text: input.trim(),
      time: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })
    };
    setMessagesMap(prev => ({
      ...prev,
      [selected.id]: [...(prev[selected.id] || []), newMsg]
    }));
    axios.post('http://localhost:8000/post/insert/message',
      {
        ChatroomID: selected.id,
        speakerID: user_id,
        message: input.trim(),
        isRead: 1
      })
    //insert newMsg
    setInput('');
    if (selected.uid == '1') {//對方是機器人才會回答
      axios.post('http://localhost:8000/robot', { message: input })
        .then(res => {
          let func = res.data.functions
          console.log(func);
          if (func === 'search_products') {
            let newAIMsg = {
              id: selected.uid,
              from: 'bot',
              text: `<img width="50px" src='${res.data.answer.img}'/>
            <a href="${res.data.answer.url}">${res.data.answer.pd_name}</a>`,
              time: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })
            };
            //insert api
            axios.post('http://localhost:8000/post/insert/message',
              {
                ChatroomID: selected.id,
                speakerID: selected.uid,
                message: newAIMsg.text,
                isRead: 1
              })
            setMessagesMap(prev => ({
              ...prev,
              [selected.id]: [...(prev[selected.id] || []), newAIMsg]
            }));
          }
          else if (func === 'get_hot_ranking') {
            res.data.answer.map((pd, idx) => {
              let newAIMsg = {
                id: selected.uid,
                from: 'bot',
                text: `<img width="50px" src='${pd.imageUrl}'/>
              <a href="http://localhost:8000/product/${pd.pid}">${pd.pd_name}</a>
              <span>NT$${pd.price}</span>`,
                time: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })
              };
              //insert api
              axios.post('http://localhost:8000/post/insert/message',
                {
                  ChatroomID: selected.id,
                  speakerID: selected.uid,
                  message: newAIMsg.text,
                  isRead: 1
                })
              setMessagesMap(prev => ({
                ...prev,
                [selected.id]: [...(prev[selected.id] || []), newAIMsg]
              }));

            })
          }
          else {
            let newAIMsg = {
              id: selected.uid,
              from: 'bot',
              text: res.data.answer,
              time: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })
            };
            //insert api
            axios.post('http://localhost:8000/post/insert/message',
              {
                ChatroomID: selected.id,
                speakerID: selected.uid,
                message: newAIMsg.text,
                isRead: 1
              })
            setMessagesMap(prev => ({
              ...prev,
              [selected.id]: [...(prev[selected.id] || []), newAIMsg]
            }));
          }

        })
    }


  };
  /**
 * 不管傳進來的是 Blob 還是 mimicked Buffer (nodejs Buffer 物件)
 * 都能轉成一條可給 <img src> 的 URL
 */
  const blobtoURL = input => {
    let blob;

    // 如果已經是瀏覽器 Blob
    if (input instanceof Blob) {
      blob = input;

      // 如果像 { type:'Buffer', data: [...] }  
    } else if (input && Array.isArray(input.data)) {
      // Uint8Array 從原生 Array 建
      const uint8 = new Uint8Array(input.data);
      // 第二個參數的 MIME type 要跟你資料庫存的檔案格式對應
      blob = new Blob([uint8], { type: 'image/jpeg' });

    } else {
      console.error('blobtoURL: 不支援的輸入格式', input);
      return '';
    }

    return URL.createObjectURL(blob);
  };

  return (
    <div className={styles.container}>
      {/* 左側 Sidebar */}
      <aside className={styles.sidebar}>
        <header className={styles.sidebarHeader}>
          <img src={blobtoURL(selected.avatar)} alt={selected.name} className={styles.avatar} />
          <div>
            <p className={styles.name}>{selected.name}</p>
            <p className={styles.sub}>上次上線時間：{selected.lastTime}</p>
          </div>
        </header>
        <ul className={styles.userList}>
          {users.map(u => (
            <li
              key={u.id}
              className={`${styles.userItem} ${u.id === selected.id ? styles.active : ''}`}
              onClick={() => setSelected(u)}
            >
              <img src={blobtoURL(u.avatar)} alt={u.name} className={styles.avatarSm} />
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

        <div key={selected.id} className={styles.messages}>
          <div className={styles.dateSep}>前天</div>
          {messages.map(m => (
            <div key={m.id} className={`${styles.message} ${m.from === 'bot' ? styles.bot : styles.user}`}>
              <span className={styles.text} dangerouslySetInnerHTML={{ __html: m.text }}></span>
              <span className={styles.time}>{m.time}</span>
            </div>
          ))}
          <div ref={messagesEndRef} />
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
            onChange={e => setInput(e.target.value)}//這裡改成函示
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="輸入訊息…"
          />
          <button className={styles.send} onClick={handleSend}>🐾</button>
        </div>
      </main>

    </div>
  );
}
