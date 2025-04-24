import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './ProductPage.module.css';
import Sidebar     from './Sidebar/Sidebar';
import FilterBar   from './FilterBar/FilterBar';
import SortBar     from './SortBar/SortBar';
import ProductList from './ProductList/ProductList';
import HotRanking  from './HotRanking/HotRanking';

export default function ProductPage() {
  // 主要 state
  const [products, setProducts]       = useState([]);
  const [filtered, setFiltered]       = useState([]);
  const [filters, setFilters]         = useState({ functions: [], brands: [], price: '' });
  const [sortBy, setSortBy]           = useState('');
  const [favoriteIds, setFavoriteIds] = useState([]);

  // 掛載時向後端撈資料
  useEffect(() => {
    axios.get('/api/products')
      .then(res => {
        setProducts(res.data);
      })
      .catch(err => console.error('Fetch products error:', err));
  }, []);

  //  products, filters, 或 sortBy 變動時，跑過濾 + 排序
  useEffect(() => {
    let result = [...products];

    // --- 過濾區---
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

    // --- 排序區---
    if (sortBy === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'createdAt') {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'hotranking') {
      result.sort((a, b) => b.hotranking - a.hotranking);
    }

    setFiltered(result);
  }, [products, filters, sortBy]);

  // 4. FilterBar 傳回 newFilters
  const handleFilterChange = newFilters => {
    setFilters(newFilters);
  };

  // 5. SortBar 傳回 sortKey
  const handleSortChange = sortKey => {
    setSortBy(sortKey);
  };

  // 6. 收藏/加入購物車 (保留你原本實作)
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

      <aside className={styles.hotRanking}>
        <HotRanking />
      </aside>
    </div>
  );
}
