import React from 'react';
import styles from './IndexStyle.module.css'


function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="col"><h6>關於好拾毛</h6><p>理念 / 購物須知 / 法規</p></div>
      <div className="col"><h6>會員專區</h6><p>個人檔案 / 購物車</p></div>
      <div className="col"><h6>商品專區</h6><p>狗狗 / 貓貓 / 特寵</p></div>
      <div className="col"><h6>聯絡我們</h6><p>jeds@…</p></div>
    </footer>
  );
}
export default Footer;