// src/component/Sidebar/Sidebar.jsx
import React, { useState } from 'react';
import styles from './SideBar.module.css';

export default function Sidebar() {
  // expandedType 存放目前展開的是哪個區域（'dog' or 'cat' or null）
  const [expandedType, setExpandedType] = useState(null);

  const toggleType = (type) => {
    setExpandedType(prev => (prev === type ? null : type));
  };

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
    </div>
  );
}
