import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './BreadCrumbs.module.css';

const nameMap = {
  '': '首頁',
  products: '商品列表',
  'second-products': '二手商品',
  cart: '購物車',
  article: '文章區',
  about: '關於我們',
  MemberCenter: '會員中心',
  profile: '個人資料',
  orders: '購物紀錄',
  'credit-card': '信用卡',
  mycollect: '我的收藏',
  mycoupon: '我的優惠券',
  myAddress: '我的地址',
  'Content-manage': '後台管理',
  'manage-market': '管理賣場',
  New_Products: '新品管理',
  Second_Products: '二手商品管理',
  User: '使用者管理',
  Article: '文章管理',
  Aboutus: '關於我們',
  Help: '幫助中心',
  Novicefeeding: '新手飼養指南',
  dog: '狗',
  cat: '貓',
  mouse: '倉鼠',
  bird: '鳥',
  HealthCheck: '健康檢查',
  Login: '登入',
  Register: '註冊',
  PartTouch: '互動小專區',
  Touch: '部位有話說',
  PetQuiz: '互動小專區',
  Quiz: '寵物小測驗',
  ProductPage: '商品頁面',
  SeProductPage: '二手商品頁面',

  // ...其他路徑段對應
};

export default function Breadcrumbs() {
  const { pathname } = useLocation();
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 0) return null;

  return (
    <nav aria-label="breadcrumb" className={styles.breadcrumbContainer}>
      <ol className={styles.breadcrumb}>
        <li className={styles.breadcrumbItem}>
          <Link to="/" className={styles.link}>{nameMap['']}</Link>
        </li>

        {segments.map((seg, i) => {
          const to = '/' + segments.slice(0, i + 1).join('/');
          const isLast = i === segments.length - 1;
          const label = nameMap[seg] || seg;  // 取對照表，找不到就顯示原始 seg

          return (
            <React.Fragment key={to}>
              <li className={styles.separator}></li>
              <li
                className={`${styles.breadcrumbItem} ${isLast ? styles.active : ''}`}
                {...(isLast ? { 'aria-current': 'page' } : {})}
              >
                {isLast
                  ? label
                  : <Link to={to} className={styles.link}>{label}</Link>
                }
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
