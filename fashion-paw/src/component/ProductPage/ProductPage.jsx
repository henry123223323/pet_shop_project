// src/component/ProductPage/ProductPage.jsx
import React, { useState, useEffect } from 'react';
import styles from './ProductPage.module.css';

import FilterBar    from './FilterBar/FilterBar';
import Sidebar      from './SideBar/SideBar';
import SortBar      from './SortBar/SortBar';
import SwitchBtn    from './SwitchBtn/SwitchBtn';
import ProductList  from './ProductList/ProductList';
import HotRanking   from './HotRanking/HotRanking';
import mockProducts from './mockProducts';

export default function ProductPage() {
  // 篩選、排序、顯示模式、資料、收藏
  const [filters, setFilters]   = useState({ functions: [], brands: [], price: '', hotRanking: '' });
  const [sortBy, setSortBy]     = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [products, setProducts] = useState([]);
  const [displayItems, setDisplay] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);

  // 初始載入
  useEffect(() => setProducts(mockProducts), []);

  // 過濾＋排序邏輯（同上）
  useEffect(() => {
    let items = [...products];
    const { functions: funcs = [], brands = [], price = '', hotRanking = '' } = filters;
    if (funcs.length)  items = items.filter(p => funcs.includes(p.function));
    if (brands.length) items = items.filter(p => brands.includes(p.brand));
    if (price) {
      const [min, max] = price.includes('+')
        ? [Number(price), Infinity]
        : price.split('-').map(Number);
      items = items.filter(p => p.price >= min && p.price <= max);
    }
    if (hotRanking === 'hot_desc')  items.sort((a,b)=>b.hotranking-a.hotranking);
    if (hotRanking === 'hot_asc')   items.sort((a,b)=>a.hotranking-b.hotranking);
    if (sortBy==='price_asc')       items.sort((a,b)=>a.price-b.price);
    else if (sortBy==='price_desc') items.sort((a,b)=>b.price-a.price);
    else if (sortBy==='createdAt')  items.sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt));
    setDisplay(items);
  }, [products, filters, sortBy]);

  const toggleFav = id => setFavoriteIds(prev =>
    prev.includes(id)? prev.filter(x=>x!==id) : [...prev,id]
  );
  const addCart = id => console.log('Add to cart', id);

  return (
    <div className={styles.pageWrapper}>

      {/* 左側主內容 */}
      <div className={styles.mainContent}>
        <div className={styles.filterBar}>
          <FilterBar onFilterChange={setFilters} />
        </div>

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
              favoriteIds={favoriteIds}
              onToggleFavorite={toggleFav}
              onAddToCart={addCart}
              viewMode={viewMode}
            />
          </section>
        </div>
      </div>

      {/* 右側獨立熱銷排行 */}
      <div className={styles.rankingSection}>
        <HotRanking />
      </div>

    </div>
  );
}
