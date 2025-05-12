import React, { useState } from 'react';
import styles from './SideBar.module.css';

export default function Sidebar({ onSelectCategory = () => {} }) {
  const [expandedType, setExpandedType] = useState(null);

  const toggleType = (type) => {
    setExpandedType(prev => (prev === type ? null : type));
  };
  const [selectedCategory, setSelectedCategory] = useState({ type: '', cat: '' });


  const categories = ['飼料', '副食', '零食', '保健食品', '生活家居', '玩具'];

  return (
    <div className={styles.sidebar}>
      <ul className={styles.menu}>
        {['dog', 'cat', 'bird', 'mouse'].map((type) => (
          <li key={type}>
            <button className={styles.expandBtn} onClick={() => toggleType(type)}>
              <span>
                {type === 'dog' && '狗狗專區'}
                {type === 'cat' && '貓咪專區'}
                {type === 'bird' && '鳥類專區'}
                {type === 'mouse' && '倉鼠專區'}
                {expandedType === type ? ' ▾' : ' ▸'}
              </span>
            </button>
            {expandedType === type && (
              <ul className={styles.sublist}>
                {categories.map((cat) => (
                  <li 
                    key={cat}
                    onClick={() => {
                      console.log(`選擇 ${type} 的 ${cat}`);
                      setSelectedCategory({ type, cat });
                      onSelectCategory(type, cat);
                    }}
                    className={`${styles.subitem} ${selectedCategory.type === type && selectedCategory.cat === cat ? styles.active : ''}`}

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
