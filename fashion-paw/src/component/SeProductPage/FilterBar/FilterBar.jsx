// src/component/ProductPage/FilterBar/FilterBar.jsx
import React, { useState, useEffect } from 'react';
import styles from './FilterBar.module.css';
import TaiwanMap from '../Map/TaiwanMap';
// import axios from 'axios';
// 一定要有這個 prices 陣列
const prices = [
  { value: '100以下', label: '100以下' },
  { value: '101-300', label: '101–300' },
  { value: '301-600', label: '301–600' },
  { value: '601-999', label: '601–999' },
  { value: '1000+', label: '1000以上' },
];
const depreciates = [1, 2, 3, 4, 5];

export default function FilterBar({
  city_town = [],
  locations = [],
  onFilterChange = () => { },
  SortProductbyTown = () => { }
}) {
  const [activeTab, setActiveTab] = useState('product');
  const [showModal, setShowModal] = useState(false);

  const [selPrice, setSelPrice] = useState('');
  const [selDep, setSelDep] = useState(0);
  const [selLocs, setSelLocs] = useState([]);
  useEffect(() => {
    console.log(city_town);
  }, [city_town]);


  useEffect(() => {
    onFilterChange({
      price: selPrice,
      depreciation: selDep,
      locations: selLocs
    });
  }, [selPrice, selDep, selLocs, onFilterChange]);

  const toggleArray = (arr, setFn, val) =>
    setFn(prev => prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]);

  const handleLocationTab = () => {
    setActiveTab('location');
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setActiveTab('product');
  };

  return (
    <div className={styles.filterBar}>
      {/* Tab 列 */}
      <div className={styles.headers}>
        <div
          className={`${styles.tab} ${activeTab === 'product' ? styles.active : styles.inactive}`}
          onClick={() => setActiveTab('product')}
        >
          找商品
        </div>
        <div
          className={`${styles.tab} ${activeTab === 'location' ? styles.active : styles.inactive}`}
          onClick={handleLocationTab}
        >
          找地區
        </div>
      </div>

      {/* 找商品 區塊：價格／折舊／所在地 */}
      {activeTab === 'product' && (
        <div className={styles.content}>
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

          {/* 所在地 */}
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
        </div>
      )}

      {/* 找地區 Modal（不動內容） */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button className={styles.modalClose} onClick={closeModal}>&times;</button>
            <TaiwanMap city={locations} town={city_town} SortProductbyTown={SortProductbyTown} close={closeModal} />
          </div>
        </div>
      )}
    </div>
  );
}
