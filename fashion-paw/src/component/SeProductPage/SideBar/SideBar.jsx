// src/component/SeProductPage/SideBar/SideBar.jsx
import React from 'react';
import styles from './SideBar.module.css';

const types = ['dog', 'cat', 'bird', 'mouse'];
const labels = {
  dog:   '狗狗專區',
  cat:   '貓貓專區',
  bird:  '鳥類專區',
  mouse: '老鼠專區'
};

export default function Sidebar({ onSelectCategory = () => {} }) {
  return (
    <div className={styles.sidebar}>
      <ul className={styles.menu}>
        {types.map(type => (
          <li key={type}>
            <button
              className="paw-bg-primary"
              onClick={() => onSelectCategory(type)}
            >
              <span className="paw-bg-primary">
                {labels[type]}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
