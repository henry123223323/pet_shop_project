import React from 'react';
import feedIcon from './images/Logo.png';
import snackIcon from './images/Logo.png';
// ... 其餘圖示

function CategoryIcons() {
  const cats = [
    { label: '飼料', icon: feedIcon },
    { label: '副食', icon: snackIcon },
    /* ... */
  ];
  return (
    <div className="category-icons">
      {cats.map(c => (
        <div key={c.label} className="cat-item">
          <img src={c.icon} alt={c.label} />
          <span>{c.label}</span>
        </div>
      ))}
    </div>
  );
}
export default CategoryIcons;
