// src/component/ProductPage/ProductPage.jsx
import React, { useState, useEffect } from 'react';
import styles from './ProductPage.module.css';

import FilterBar  from './FilterBar/FilterBar';
import Sidebar    from './SideBar/SideBar';
import SortBar    from './SortBar/SortBar';
import SwitchBtn  from './SwitchBtn/SwitchBtn';
import ProductList from './ProductList/ProductList';
import mockProducts from './mockProducts';

export default function ProductPage() {
  const [filters, setFilters]      = useState({ functions: [], brands: [], price: '' });
  const [sortBy, setSortBy]        = useState('');
  const [viewMode, setViewMode]    = useState('grid');
  const [products, setProducts]    = useState([]);
  const [displayItems, setDisplay] = useState([]);

  useEffect(() => {
    setProducts(mockProducts);
  }, []);

  useEffect(() => {
    let items = [...products];
    // TODO: filter + sort logic
    setDisplay(items);
  }, [products, filters, sortBy]);

  return (
    <div className={styles.container}>

      {/* 如果你還有其他篩選（價格、品牌⋯⋯），就留在這裡 */}
      <div className={styles.filterBar}>
        <FilterBar onFilterChange={setFilters} />
      </div>

      {/* 這一列只放排序＋切換按鈕，往右對齊 */}
      <div className={styles.topBar}>
        <SortBar onSortChange={setSortBy} />
        <SwitchBtn viewMode={viewMode} onViewChange={setViewMode} />
      </div>

      <div className={styles.content}>
        <aside className={styles.sidebar}>
          <Sidebar onSelectCategory={() => {}} />
        </aside>

        <section className={styles.main}>
          <ProductList
            products={displayItems}
            favoriteIds={[]}
            onToggleFavorite={() => {}}
            onAddToCart={() => {}}
            viewMode={viewMode}
          />
        </section>
      </div>
    </div>
  );
}
