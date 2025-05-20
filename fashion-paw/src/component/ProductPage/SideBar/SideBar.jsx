 // src/component/ProductPage/SideBar/SideBar.jsx
 import React, { useState } from 'react';
 import styles from './SideBar.module.css';

export default function Sidebar({ onSelectCategory = () => {} }) {
  const [expandedType, setExpandedType] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState({ type: '', cat: '' });

  const toggleType = (type) => {
    setExpandedType(prev => {
      if (prev === type) {
        setSelectedCategory({ type: '', cat: '' });
        onSelectCategory('', '');
        return null;
      } else {
        setSelectedCategory({ type: '', cat: '' });
        onSelectCategory('', '');
        return type;
      }
    });
  };

  const categories = ['飼料', '副食', '零食', '保健食品', '生活家居', '玩具'];

  return (
    <div className={styles.sidebar}>
      <ul className={styles.menu}>
        {['dog','cat','bird','mouse'].map(type => (
          <li key={type}>
            <button onClick={() => toggleType(type)} className={styles.expandBtn}>
              {type==='dog'? '狗狗專區':
               type==='cat'? '貓咪專區':
               type==='bird'? '鳥類專區': '倉鼠專區'}
              {expandedType===type?' ▾':' ▸'}
            </button>
            {expandedType===type && (
              <ul className={styles.sublist}>
                {categories.map(cat=>(
                  <li
                    key={cat}
                    onClick={()=>{
                      setSelectedCategory({ type, cat });
                      onSelectCategory(type, cat);
                    }}
                    className={`${styles.subitem} ${
                      selectedCategory.type===type && selectedCategory.cat===cat
                        ? styles.active : ''
                    }`}
                  >{cat}</li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
