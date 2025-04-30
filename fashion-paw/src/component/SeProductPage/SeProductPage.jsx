// src/component/SeProductPage/SeProductPage.jsx
import React, { useState, useEffect } from 'react';
import styles from './SeProductPage.module.css';

import SideBar     from './SideBar/SideBar';
import FilterBar   from './FilterBar/FilterBar';
import SortBar     from './SortBar/SortBar';
import SwitchBtn   from './SwitchBtn/SwitchBtn';
import ProductList from './ProductList/ProductList';

import mockSeProducts from './mockSepProducts';

export default function SeProductPage() {
  const [viewMode, setViewMode]           = useState('grid');
  const [products, setProducts]           = useState([]);
  const [filtered, setFiltered]           = useState([]);
  const [filters, setFilters]             = useState({
    functions: [], price: '', locations: [], depreciation: 0
  });
  const [sortBy, setSortBy]               = useState('');
  const [favoriteIds, setFavoriteIds]     = useState([]);
  const [selectedType, setSelectedType]   = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // 載入 mock 資料
  useEffect(() => {
    setProducts(mockSeProducts);
  }, []);

  // 過濾 + 排序
  useEffect(() => {
    let result = [...products];

    // 解構並給預設值，避免未定義
    const {
      functions = [],
      price     = '',
      locations = [],
      depreciation = 0
    } = filters;

    // 類型＆分類
    if (selectedType)     result = result.filter(p => p.pet_type === selectedType);
    if (selectedCategory) result = result.filter(p => p.category === selectedCategory);

    // 價格篩選
    if (price) {
      const [min, max] = price.includes('+')
        ? [Number(price), Infinity]
        : price.split('-').map(Number);
      result = result.filter(p => p.price >= min && p.price <= max);
    }

    // 功能篩選
    if (functions.length > 0) {
      result = result.filter(p => functions.includes(p.function));
    }

    // 地點篩選
    if (locations.length > 0) {
      result = result.filter(p => locations.includes(p.location));
    }

    // 折舊程度
    if (depreciation) {
      result = result.filter(p => p.depreciation === depreciation);
    }

    // 排序
    if (sortBy === 'price_asc')        result.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price_desc')  result.sort((a, b) => b.price - a.price);
    else if (sortBy === 'createdAt')   result.sort((a, b) =>
      new Date(b.createdAt) - new Date(a.createdAt)
    );
    else if (sortBy === 'hotranking')  result.sort((a, b) => b.hotranking - a.hotranking);

    setFiltered(result);
  }, [
    products,
    filters,            // 監聽整個 filters 物件
    sortBy,
    selectedType,
    selectedCategory
  ]);

  const handleFilterChange   = nf => setFilters(nf);
  const handleSortChange     = sk => setSortBy(sk);
  const handleToggleFavorite = id => {
    setFavoriteIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };
  const handleAddToCart      = id => console.log('Add to cart', id);
  const handleSelectCategory = (t, c) => {
    setSelectedType(t);
    setSelectedCategory(c);
  };

  const uniqueLocations = Array.from(new Set(products.map(p => p.location)));

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <SideBar onSelectCategory={handleSelectCategory} />
      </aside>

      <main className={styles.main}>
        {/* 1. FilterBar */}
        <div className={styles.filterBar}>
          <FilterBar
            locations={uniqueLocations}
            onFilterChange={handleFilterChange}
          />
        </div>

        {/* 2. SortBar + SwitchBtn 同列靠右 */}
        <div className={styles.topBar}>
          <SortBar onSortChange={handleSortChange} />
          <SwitchBtn viewMode={viewMode} onViewChange={setViewMode} />
        </div>

        {/* 3. ProductList，傳入 viewMode */}
        <ProductList
          products={filtered}
          favoriteIds={favoriteIds}
          onToggleFavorite={handleToggleFavorite}
          onAddToCart={handleAddToCart}
          viewMode={viewMode}
        />
      </main>
    </div>
  );
}
