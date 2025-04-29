import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './IndexStyle.module.css'


const megaNewProduct = {
  '/new': {
    sidebar: [
      { label: '狗狗', icon: '/feather 1.svg', to: '/new/Dog' },
      { label: '貓咪', icon: '/feather 1.svg', to: '/second/snack' },
      { label: '倉鼠', icon: '/icons/toy.svg', to: '/second/toy' },
      { label: '鳥', icon: '/icons/toy.svg', to: '/second/toy' }
      // …
    ],
    tabs: ['飼料', '副食', '零食', '保健品', '生活家居', '玩具'],
    content: {
      飼料: [ /* 圖片＋名稱陣列 */],
      副食: [ /* … */],
      零食: [ /* … */],
      保健品: [ /* … */],
      生活家居: [ /* … */],
      玩具: [ /* … */]
    }
  },
  '/second': {
    sidebar: [
      { label: '狗狗', icon: '/feather 1.svg', to: '/new/Dog' },
      { label: '貓咪', icon: '/feather 1.svg', to: '/second/snack' },
      { label: '倉鼠', icon: '/icons/toy.svg', to: '/second/toy' },
      { label: '鳥', icon: '/icons/toy.svg', to: '/second/toy' }
      // …
    ],
    tabs: ['飼料', '副食', '零食', '保健品', '生活家居', '玩具'],
    content: {
      飼料: [ /* 圖片＋名稱陣列 */],
      副食: [ /* … */],
      零食: [ /* … */],
      保健品: [ /* … */],
      生活家居: [ /* … */],
      玩具: [ /* … */]
    }
  }
  // 如果其他主選項也要 mega，就再加一筆
};


function MainNav() {
  return (
    <nav className={styles.mainNav}>
      <ul className={styles.menu}>
        <li><NavLink to="/about">關於我們</NavLink></li>

        <li>
          <NavLink to="/new" className={styles.dropdown}>新品專區</NavLink>
          <ul className={styles.dropdownMenu}>
            <li><NavLink to="/second/food">狗狗</NavLink></li>
            <li><NavLink to="/second/food">貓咪</NavLink></li>
            <li><NavLink to="/second/food">倉鼠</NavLink></li>
            <li><NavLink to="/second/food">鳥</NavLink></li>
          </ul>
        </li>

        <li><NavLink to="/second">二手專區</NavLink></li>

        <li><NavLink to="/knowledge" className={styles.dropdown}>寵物小知識</NavLink>
          <ul className={styles.dropdownMenu}>
            <li>知識小文章</li>
            <li><NavLink to="/second/food">新手飼養指南</NavLink></li>
            <li><NavLink to="/second/food">健康檢查篇</NavLink></li>
            <li>互動小專區</li>
            <li><NavLink to="/second/food">部位有話說</NavLink></li>
            <li><NavLink to="/second/food">問答知多少</NavLink></li>
          </ul></li>
      </ul>




    </nav>
  );
}
export default MainNav;
