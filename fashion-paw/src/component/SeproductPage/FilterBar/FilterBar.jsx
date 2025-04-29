// src/component/ProductPage/FilterBar/FilterBar.jsx
import React, { useState, useEffect } from 'react';
import styles from './FilterBar.module.css';

const functions   = ['乾糧', '副食', '保健食品', '玩具', '零食', '生活用品'];
const prices      = [
  { value: '0-100',   label: '100以下' },
  { value: '101-300', label: '101–300' },
  { value: '301-600', label: '301–600' },
  { value: '601-999', label: '601–999' },
  { value: '1000+',   label: '1000以上' },
];
const locations   = ['OO縣', 'OO市', 'OO縣', 'OO縣', 'OO縣'];
const depreciates = [1, 2, 3, 4, 5];  // 代表 🐾、🐾🐾 …等級

export default function FilterBar({ onFilterChange = () => {} }) {
  const [selFuncs, setSelFuncs] = useState([]);
  const [selPrice, setSelPrice] = useState('');
  const [selLocs, setSelLocs]   = useState([]);
  const [selDep, setSelDep]     = useState(0);

  useEffect(() => {
    onFilterChange({
      functions: selFuncs,
      price:      selPrice,
      locations:  selLocs,
      depreciation: selDep
    });
  }, [selFuncs, selPrice, selLocs, selDep]);

  const toggleArray = (arr, setFn, val) => {
    setFn(prev => prev.includes(val)
      ? prev.filter(x => x !== val)
      : [...prev, val]
    );
  };

  return (
    <div className={styles.filterBar}>
      {/* 功能 */}
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

      {/* 價格 */}
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

      {/* 所在位置 */}
      <div className={styles.row}>
        <span className={styles.label}>所在地</span>
        <div className={styles.options}>
          {locations.map(loc => (
            <label key={loc}>
              <input
                type="checkbox"
                checked={selLocs.includes(loc)}
                onChange={() => toggleArray(selLocs, setSelLocs, loc)}
              />
              {loc}
            </label>
          ))}
        </div>
      </div>

      {/* 折舊程度 */}
      <div className={styles.row}>
        <span className={styles.label}>折舊程度</span>
        <div className={styles.options}>
          {depreciates.map(n => (
            <label key={n}>
              <input
                type="radio"
                name="depreciation"
                value={n}
                checked={selDep === n}
                onChange={() => setSelDep(n)}
              />
              {Array(n).fill('🐾').join('')}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}