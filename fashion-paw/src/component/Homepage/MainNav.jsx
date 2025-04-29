import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './IndexStyle.module.css'

function MainNav() {
  return (
    <nav className={styles.mainNav}>
      <NavLink to="/about">關於我們</NavLink>
      <NavLink to="/ProductPage">新品專區</NavLink>
      <NavLink to="/SeProductPage">二手專區</NavLink>
      <NavLink to="/knowledge">寵物小知識</NavLink>
    </nav>
  );
}
export default MainNav;
