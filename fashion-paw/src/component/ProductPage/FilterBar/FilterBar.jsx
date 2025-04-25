// src/component/ProductPage/FilterBar/FilterBar.jsx
import React, { useState, useEffect } from 'react';
import styles from './FilterBar.module.css';

const functions = ['功能', '食品', '玩具', '家居'];
const brands    = ['AAAA', 'BBBB', 'CCCC'];
const prices    = [
  { value: '0-100',    label: '100以下' },
  { value: '101-300',  label: '101–300' },
  { value: '301-600',  label: '301–600' },
  { value: '601-999',  label: '601–999' },
  { value: '1000+',    label: '1000以上' },
];

export default function FilterBar({ onFilterChange = () => {} }) {
  const [selFuncs, setSelFuncs] = useState([]);
  const [selBrands, setSelBrands] = useState([]);
  const [selPrice,  setSelPrice]  = useState('');

  // 每次狀態改變就通知父元件
  useEffect(() => {
    onFilterChange({ functions: selFuncs, brands: selBrands, price: selPrice });
  }, [selFuncs, selBrands, selPrice]);

  const toggleArray = (arr, setFn, val) => {
    setFn(prev => prev.includes(val) ? prev.filter(x => x!==val) : [...prev, val]);
  };

  return (
    <div className={styles.filterBar}>
      {/* 第一行：功能 */}
      <div className={styles.row}>
        <span className={styles.label}>功能</span>
        <div className={styles.options}>
          {functions.map(f => (
            <label key={f}>
              <input
                type="checkbox"
                checked={selFuncs.includes(f)}
                onChange={() => toggleArray(selFuncs, setSelFuncs, f)}
              />
              {f}
            </label>
          ))}
        </div>
      </div>

      {/* 第二行：品牌 */}
      <div className={styles.row}>
        <span className={styles.label}>品牌</span>
        <div className={styles.options}>
          {brands.map(b => (
            <label key={b}>
              <input
                type="checkbox"
                checked={selBrands.includes(b)}
                onChange={() => toggleArray(selBrands, setSelBrands, b)}
              />
              {b}
            </label>
          ))}
        </div>
      </div>

      {/* 第三行：價格 */}
      <div className={styles.row}>
        <span className={styles.label}>價格</span>
        <div className={styles.options}>
          {prices.map(p => (
            <label key={p.value}>
              <input
                type="radio"
                name="price"
                value={p.value}
                checked={selPrice === p.value}
                onChange={() => setSelPrice(p.value)}
              />
              {p.label}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
