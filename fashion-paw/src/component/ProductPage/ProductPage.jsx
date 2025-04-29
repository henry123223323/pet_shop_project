// src/component/ProductPage/ProductPage.jsx
import React, { useState, useEffect } from 'react';
import styles from './ProductPage.module.css';
<<<<<<< HEAD

import Sidebar     from './Sidebar/Sidebar';
import FilterBar   from './FilterBar/FilterBar';
import SortBar     from './SortBar/SortBar';
import ProductList from './ProductList/ProductList';
import HotRanking  from './HotRanking/HotRanking';
import mockProducts from './mockProducts';

export default function ProductPage() {
  const [filtered, setFiltered]       = useState(mockProducts);
  const [filters, setFilters]         = useState({ functions: [], brands: [], price: '' });
  const [sortBy, setSortBy]           = useState('');
  const [favoriteIds, setFavoriteIds] = useState([]);

  // 當 filters 或 sortBy 改變時，重算 filtered
  useEffect(() => {
    let result = mockProducts;

    // --- 1) 過濾 ---
    const { functions, brands, price } = filters;
    if (price) {
      const [min, max] = price.includes('+')
        ? [Number(price), Infinity]
        : price.split('-').map(Number);
      result = result.filter(p => p.price >= min && p.price <= max);
    }
    if (brands.length) {
      result = result.filter(p => brands.includes(p.brand));
    }
    if (functions.length) {
      result = result.filter(p => functions.includes(p.function));
    }

    // --- 2) 排序 ---
    if (sortBy === 'price_asc') {
      result = result.slice().sort((a,b)=> a.price - b.price);
    } else if (sortBy === 'price_desc') {
      result = result.slice().sort((a,b)=> b.price - a.price);
    } else if (sortBy === 'createdAt') {
      result = result.slice().sort((a,b)=> new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'updatedAt') {
      result = result.slice().sort((a,b)=> new Date(b.updatedAt) - new Date(a.updatedAt));
    }

    setFiltered(result);
  }, [filters, sortBy]);

  // FilterBar 傳回 newFilters
  const handleFilterChange = newFilters => {
    setFilters(newFilters);
  };

  // SortBar 傳回 sortKey
  const handleSortChange = sortKey => {
    setSortBy(sortKey);
  };

  // 收藏、加入購物車維持你之前的實作
  const handleToggleFavorite = id => { /* ... */ };
  const handleAddToCart      = id => { /* ... */ };

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <Sidebar />
      </aside>

      <main className={styles.main}>
        <FilterBar onFilterChange={handleFilterChange} />
        <SortBar   onSortChange={handleSortChange} />
        <ProductList
          products={filtered}
          favoriteIds={favoriteIds}
          onToggleFavorite={handleToggleFavorite}
          onAddToCart={handleAddToCart}
        />
      </main>
=======
import FilterBar from './FilterBar/FilterBar';
import Sidebar from './SideBar/SideBar';
import SortBar from './SortBar/SortBar';
import SwitchBtn from './SwitchBtn/SwitchBtn';
import ProductList from './ProductList/ProductList';
import mockProducts from './mockProducts';

export default function ProductPage() {
  // 篩選條件
  const [filters, setFilters] = useState({ functions: [], brands: [], price: '' });
  // 排序方式
  const [sortBy, setSortBy] = useState('');
  // 顯示模式：grid or list
  const [viewMode, setViewMode] = useState('grid');

  // 全部商品
  const [products, setProducts] = useState([]);
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
      {/* 上方篩選列 */}
      <div className={styles.card}>
        <FilterBar onFilterChange={setFilters} />
      </div>

      <div className={styles.card}>
        <div className={styles.layout}>
          {/* 側邊分類 */}
          <div className={styles.sidebar}>
            <Sidebar onSelectCategory={() => {}} />
          </div>

          {/* 主區域：排序 + 顯示切換 + 商品列表 */}
          <div className={styles.main}>
            <div className={styles.sortBar}>
              <SortBar onSortChange={setSortBy} />
              <SwitchBtn viewMode={viewMode} onViewChange={setViewMode} />
            </div>
>>>>>>> test

            <div className={
              viewMode === 'grid' ? styles.gridView : styles.listView
            }>
              <ProductList products={displayItems} viewMode={viewMode} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
