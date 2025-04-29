<<<<<<< HEAD
// src/component/Sidebar/Sidebar.jsx
import React, { useState } from 'react';
import styles from './SideBar.module.css';

export default function Sidebar() {
  // expandedType 存放目前展開的是哪個區域（'dog' or 'cat' or null）
=======
import React, { useState } from 'react';
import styles from './SideBar.module.css';

export default function Sidebar({ onSelectCategory = () => {} }) {
>>>>>>> yudong
  const [expandedType, setExpandedType] = useState(null);

  const toggleType = (type) => {
    setExpandedType(prev => (prev === type ? null : type));
  };

<<<<<<< HEAD
  return (
    <div className={styles.sidebar}>
      {/* 動物專區 */}
      <section className={styles.section}>
        <ul className={styles.menu}>
          <li>
            <button
              className={styles.toggleBtn}
              onClick={() => toggleType('dog')}
            >
               狗狗專區
              <span className={styles.arrow}>
                {expandedType === 'dog' ? '▾' : '▸'}
              </span>
            </button>
            {expandedType === 'dog' && (
              <ul className={styles.sublist}>
                <li><label><input type="checkbox" /> 飼料</label></li>
                <li><label><input type="checkbox" /> 副食</label></li>
                <li><label><input type="checkbox" /> 零食</label></li>
                <li><label><input type="checkbox" /> 保健食品</label></li>
                <li><label><input type="checkbox" /> 家居</label></li>
                <li><label><input type="checkbox" /> 玩具</label></li>
              </ul>
            )}
          </li>
          <li>
            <button
              className={styles.toggleBtn}
              onClick={() => toggleType('cat')}
            >
               貓貓專區
              <span className={styles.arrow}>
                {expandedType === 'cat' ? '▾' : '▸'}
              </span>
            </button>
            {expandedType === 'cat' && (
              <ul className={styles.sublist}>
                {/* 這裡放貓貓專區的子項 */}
                <li><label><input type="checkbox" /> 飼料</label></li>
                <li><label><input type="checkbox" /> 副食</label></li>
                <li><label><input type="checkbox" /> 零食</label></li>
                <li><label><input type="checkbox" /> 保健食品</label></li>
                <li><label><input type="checkbox" /> 家居</label></li>
                <li><label><input type="checkbox" /> 玩具</label></li>
              </ul>
            )}
          </li>
          {/* 你可以再多加其他動物 */}
        </ul>
      </section>
      {/* 其他 section… */}
=======
  const categories = ['飼料', '副食', '零食', '保健食品', '家居', '玩具'];

  return (
    <div className={styles.sidebar}>
      <ul className={styles.menu}>
        {['dog', 'cat', 'bird', 'mouse'].map((type) => (
          <li key={type}>
            <button className='paw-bg-primary' onClick={() => toggleType(type)}>
              <span className='paw-bg-primary'>
                {type === 'dog' && '狗狗專區'}
                {type === 'cat' && '貓貓專區'}
                {type === 'bird' && '鳥類專區'}
                {type === 'mouse' && '老鼠專區'}
                {expandedType === type ? '▾' : '▸'}
              </span>
            </button>
            {expandedType === type && (
              <ul className={styles.sublist}>
                {categories.map((cat) => (
                  <li 
                    key={cat}
                    onClick={() => {
                      console.log(`選擇 ${type} 的 ${cat}`);
                      onSelectCategory(type, cat);
                    }}
                    className={styles.subitem}
                  >
                    {cat}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
>>>>>>> yudong
    </div>
  );
}
