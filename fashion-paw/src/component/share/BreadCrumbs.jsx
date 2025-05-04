import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './BreadCrumbs.module.css';

export default function Breadcrumbs() {
  const { pathname } = useLocation();
  const pathnames = pathname.split('/').filter(Boolean);

  return (
    <nav aria-label="breadcrumb" className={styles.breadcrumbContainer}>
      <ol className={styles.breadcrumb}>
        <li className={styles.breadcrumbItem}>
          <Link to="/" className={styles.link}>首頁</Link>
        </li>
        {pathnames.map((seg, i) => {
          const to = '/' + pathnames.slice(0, i + 1).join('/');
          const isLast = i === pathnames.length - 1;
          return (
            <React.Fragment key={to}>
              <li className={styles.separator}></li>
              <li
                className={`${styles.breadcrumbItem} ${isLast ? styles.active : ''}`}
                {...(isLast ? { 'aria-current': 'page' } : {})}
              >
                {isLast
                  ? seg
                  : <Link to={to} className={styles.link}>{seg}</Link>
                }
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
