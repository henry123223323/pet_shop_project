// src/component/ProductPage/FilterBar/FilterBar.jsx
import React, { useState, useEffect } from 'react';
import styles from './FilterBar.module.css';

const functionsList = ['食品', '玩具', '家居'];
const brandsList    = ['AAAA', 'BBBB', 'CCCC'];
const prices        = [
  { value: '100以下',   label: '100以下' },
  { value: '101-300',   label: '101–300' },
  { value: '301-600',   label: '301–600' },
  { value: '601-999',   label: '601–999' },
  { value: '1000+',     label: '1000以上' },
];
const depreciates   = [1, 2, 3, 4, 5];  // 🐾…🐾🐾🐾🐾

export default function FilterBar({
  locations = [],            // 從父層傳入去重後的地點清單
  onFilterChange = () => {}
}) {
  const [selFunctions, setSelFunctions] = useState([]);
  const [selBrands,    setSelBrands]    = useState([]);
  const [selPrice,     setSelPrice]     = useState('');
  const [selLocs,      setSelLocs]      = useState([]);
  const [selDep,       setSelDep]       = useState(0);

  // 每次任何篩選參數改變就送給父元件
  useEffect(() => {
    onFilterChange({
      functions:    selFunctions,
      brands:       selBrands,
      price:        selPrice,
      locations:    selLocs,
      depreciation: selDep
    });
  }, [selFunctions, selBrands, selPrice, selLocs, selDep]);

  const toggleArray = (arr, setFn, val) => {
    setFn(prev =>
      prev.includes(val)
        ? prev.filter(x => x !== val)
        : [...prev, val]
    );
  };

  return (
    <div className={styles.filterBar}>
      {/* 上方標題列 */}
      <div className={styles.headers}>
        <div className={styles.productHeader}>找商品</div>
        <div className={styles.locationHeader}>找地區</div>
      </div>

      {/* 內容區：左右並排 */}
      <div className={styles.content}>
        {/* 左半：商品篩選 */}
        <div className={styles.productFilters}>

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

        {/* 右半：地區篩選＋搜尋按鈕 */}
        <div className={styles.locationFilters}>
          <div className={styles.row}>
            <span className={styles.label}>所在地</span>
            <div className={styles.options}>
              {locations.map((loc, idx) => (
                <label key={`${loc}-${idx}`}>
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

          <div className={styles.searchBtnWrapper}>
            <button
              type="button"
              className={styles.searchBtn}
              onClick={() => onFilterChange({  // 如果你想要點按才觸發一次過濾
                functions:    selFunctions,
                brands:       selBrands,
                price:        selPrice,
                locations:    selLocs,
                depreciation: selDep
              })}
            >
              搜尋
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
