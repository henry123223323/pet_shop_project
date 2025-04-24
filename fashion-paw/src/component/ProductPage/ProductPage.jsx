import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './ProductPage.module.css';

// Components
import Sidebar     from './Sidebar/Sidebar';
import FilterBar   from './FilterBar/FilterBar';
import SortBar     from './SortBar/SortBar';
import ProductList from './ProductList/ProductList';
import HotRanking  from './HotRanking/HotRanking';

export default function ProductPage() {
  // ---------------------------------------------
  // 🔧 State 區塊
  // ---------------------------------------------
  const [products, setProducts]       = useState([]);      // 所有商品資料
  const [filtered, setFiltered]       = useState([]);      // 篩選後的商品
  const [filters, setFilters]         = useState({         // 篩選條件
    functions: [],
    brands: [],
    price: ''
  });
  const [sortBy, setSortBy]           = useState('');      // 排序依據
  const [favoriteIds, setFavoriteIds] = useState([]);      // 收藏商品 ID 列表
  const [selectedType, setSelectedType] = useState(null);  // 寵物類型
  const [selectedCategory, setSelectedCategory] = useState(null); // 商品分類

  // ---------------------------------------------
  // 🚀 第一次掛載：取得所有商品
  // ---------------------------------------------
  useEffect(() => {
    axios.get('/api/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error('Fetch products error:', err));
  }, []);

  // ---------------------------------------------
  // 📦 根據 filters、sortBy、類型分類做商品過濾 + 排序
  // ---------------------------------------------
  useEffect(() => {
    let result = [...products];
    const { functions, brands, price } = filters;

    // 類型分類（狗、貓…）
    if (selectedType) {
      result = result.filter(p => p.pet_type === selectedType);
    }

    if (selectedCategory) {
      result = result.filter(p => p.category === selectedCategory);
    }

    // 價格區間
    if (price) {
      const [min, max] = price.includes('+')
        ? [Number(price), Infinity]
        : price.split('-').map(Number);
      result = result.filter(p => p.price >= min && p.price <= max);
    }

    // 品牌
    if (brands.length) {
      result = result.filter(p => brands.includes(p.brand));
    }

    // 功能
    if (functions.length) {
      result = result.filter(p => functions.includes(p.function));
    }

    // 排序
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
  }, [products, filters, sortBy, selectedType, selectedCategory]);

  // ---------------------------------------------
  // 🔁 處理 filter 與 sort 傳回的 callback
  // ---------------------------------------------
  const handleFilterChange = newFilters => setFilters(newFilters);
  const handleSortChange = sortKey => setSortBy(sortKey);

  // ---------------------------------------------
  // 💖 收藏 / 🛒 加入購物車（可自行補功能）
  // ---------------------------------------------
  const handleToggleFavorite = id => { /* your code here */ };
  const handleAddToCart = id => { /* your code here */ };

  // ---------------------------------------------
  // 📂 處理 Sidebar 點選分類
  // ---------------------------------------------
  const handleSelectCategory = (type, category) => {
    setSelectedType(type);
    setSelectedCategory(category);
  };

  // ---------------------------------------------
  // 📦 畫面輸出
  // ---------------------------------------------
  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <Sidebar onSelectCategory={handleSelectCategory} />
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
