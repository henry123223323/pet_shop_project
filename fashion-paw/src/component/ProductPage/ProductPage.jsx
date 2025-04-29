// src/component/ProductPage/ProductPage.jsx
import React, { useState, useEffect } from 'react';
import styles from './ProductPage.module.css';
import FilterBar from './FilterBar/FilterBar';
import Sidebar from './Sidebar/Sidebar';
import SortBar from './SortBar/SortBar';
import SwitchBtn from './SwitchBtn/SwitchBtn';
import ProductList from './ProductList/ProductList';
import mockProducts from './mockProducts';

export default function ProductPage() {
  // 篩選條件
  const [filters, setFilters] = useState({ functions: [], brands: [], price: '' });
  // 排序方式
  const [sortBy, setSortBy]     = useState('');
  // 顯示模式：grid or list
  const [viewMode, setViewMode] = useState('grid');

  // 全部商品
  const [products, setProducts]         = useState([]);
  // 畫面上要顯示的商品
  const [displayItems, setDisplayItems] = useState([]);

  // 初始讀取 mock 資料
  useEffect(() => {
    setProducts(mockProducts);
  }, []);

  // 當 products/filters/sortBy 變動時，刷新畫面列表
  useEffect(() => {
    let items = [...products];
    // TODO: 加入過濾邏輯 (functions, brands, price)
    // TODO: 加入排序邏輯 (sortBy)
    setDisplayItems(items);
  }, [products, filters, sortBy]);

return (
  <div className={styles.container}>

    {/* 第一張卡：篩選器 */}
    <div className={styles.card}>
      <FilterBar onFilterChange={setFilters} />
    </div>

    {/* 第二張卡：分類＋列表 */}
    <div className={styles.card}>
      <div className={styles.layout}>
        <div className={styles.sidebar}>
          <Sidebar />
        </div>
        <div className={styles.main}>
          <div className={styles.sortBar}>
            <SortBar onSortChange={setSortBy} />
            <SwitchBtn viewMode={viewMode} onViewChange={setViewMode} />
          </div>
          <div className={viewMode === 'grid' ? styles.gridView : styles.listView}>
            <ProductList products={displayItems} viewMode={viewMode} />
          </div>
        </div>
      </div>
    </div>

  </div>
);

}
