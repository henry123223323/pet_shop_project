// src/component/Sidebar/Sidebar.jsx
import React from 'react';
import styles from './Sidebar.module.css';

const petTypes = ['狗', '貓', '鳥', '老鼠'];
const categories = ['玩具', '乾糧', '保健食品', '副食/零食','生活家居'];

export default function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <section className={styles.section}>
        <h4>狗狗區</h4>
        <ul>
          {categories.map(type => (
            <li key={type}>
              <label>
                <input type="checkbox" name="petType" value={type} />{' '}
                {type}
              </label>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <h4>貓貓區</h4>
        <ul>
          {categories.map(cat => (
            <li key={cat}>
              <label>
                <input type="checkbox" name="category" value={cat} />{' '}
                {cat}
              </label>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
