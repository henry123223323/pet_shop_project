// src/component/SideBar/SideBar.jsx
import React, { useState } from 'react';
import styles from './SideBar.module.css';

export default function Sidebar({ onSelectCategory = () => {} }) {
  const [expandedType, setExpandedType] = useState(null);

  const categories = ['飼料', '副食', '零食', '保健食品', '家居', '玩具'];

  const toggleType = (type) => {
    const isSame = expandedType === type;
    const nextType = isSame ? null : type;  // 決定展開還是收起
    setExpandedType(nextType);

    if (isSame) {
      // 收起時：清掉所有篩選
      onSelectCategory('', '');
    } else {
      // 展開時：先套用純 type 篩選
      onSelectCategory(type, '');
    }
  };

  return (
    <div className={styles.sidebar}>
      <ul className={styles.menu}>
        {['dog', 'cat', 'bird', 'mouse'].map((type) => (
          <li key={type}>
            <button
              className="paw-bg-primary"
              onClick={() => toggleType(type)}
            >
              {type === 'dog'   && ' 狗狗專區'}
              {type === 'cat'   && ' 貓貓專區'}
              {type === 'bird'  && ' 鳥類專區'}
              {type === 'mouse' && ' 老鼠專區'}
              <span className="ms-2">
                {expandedType === type ? '▾' : '▸'}
              </span>
            </button>

            {expandedType === type && (
              <ul className={styles.sublist}>
                {categories.map((cat) => (
                  <li
                    key={cat}
                    className={styles.subitem}
                    onClick={() => onSelectCategory(type, cat)}
                  >
                    {cat}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
