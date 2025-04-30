import React, { useState, useEffect } from 'react';
// import axios from 'axios'; 先不用 axios，先註解掉
import styles from './SeProductPage.module.css';

// Components
import SideBar from './SideBar/SideBar';
import FilterBar from './FilterBar/FilterBar';
import SortBar from './SortBar/SortBar';
import ProductList from './ProductList/ProductList';

// Mock Data
import mockSeProducts from './mockSepProducts';

export default function SeProductPage() {
  // ---------------------------------------------
  //  State 區塊
  // ---------------------------------------------
  const [products, setProducts]                   = useState([]);
  const [filtered, setFiltered]                   = useState([]);
  const [filters, setFilters]                     = useState({
    functions: [],
    price: '',
    locations: [],
    depreciation: 0
  });

  const [sortBy, setSortBy]                       = useState('');
  const [favoriteIds, setFavoriteIds]             = useState([]);
  const [selectedType, setSelectedType]           = useState(null);
  const [selectedCategory, setSelectedCategory]   = useState(null);

  // ---------------------------------------------
  //  第一次掛載：載入假資料
  // ---------------------------------------------
  useEffect(() => {
    setProducts(mockSeProducts);
  }, []);

  // ---------------------------------------------
  //  去重後的地點清單（給 FilterBar 用）
  // ---------------------------------------------
  const uniqueLocations = Array.from(
    new Set(products.map(p => p.location))
  );

  // ---------------------------------------------
  // 根據 filters、sortBy、類型分類做商品過濾 + 排序
  // ---------------------------------------------
  useEffect(() => {
    let result = [...products];
    const { functions, price, locations, depreciation } = filters;

    // 類型＆分類
    if (selectedType) {
      result = result.filter(p => p.pet_type === selectedType);
    }
    if (selectedCategory) {
      result = result.filter(p => p.category === selectedCategory);
    }

    // 價格篩選
    if (price) {
      const [min, max] = price.includes('+')
        ? [Number(price), Infinity]
        : price.split('-').map(Number);
      result = result.filter(p => p.price >= min && p.price <= max);
    }

    // 功能篩選
    if (functions.length) {
      result = result.filter(p => functions.includes(p.function));
    }

    // 地點篩選
    if (locations.length) {
      result = result.filter(p => locations.includes(p.location));
    }

    // 折舊程度篩選
    if (depreciation) {
      result = result.filter(p => p.depreciation === depreciation);
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
  }, [
    products,
    filters.functions,
    filters.price,
    filters.locations,
    filters.depreciation,
    sortBy,
    selectedType,
    selectedCategory
  ]);

  // ---------------------------------------------
  // 🔁 處理 filter 與 sort 傳回的 callback
  // ---------------------------------------------
  const handleFilterChange = newFilters => setFilters(newFilters);
  const handleSortChange   = sortKey    => setSortBy(sortKey);

  // ---------------------------------------------
  // 收藏 / 加入購物車
  // ---------------------------------------------
  const handleToggleFavorite = id => {
    setFavoriteIds(prev =>
      prev.includes(id)
        ? prev.filter(favId => favId !== id)
        : [...prev, id]
    );
  };
  const handleAddToCart = id => {
    console.log(`加入購物車 id=${id}`);
    // 可以接後端購物車 API
  };

  // ---------------------------------------------
  // 處理 Sidebar 點選分類
  // ---------------------------------------------
  const handleSelectCategory = (type, category) => {
    setSelectedType(type);
    setSelectedCategory(category);
  };

  // ---------------------------------------------
  // 畫面輸出
  // ---------------------------------------------
  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <SideBar onSelectCategory={handleSelectCategory} />
      </aside>

      <main className={styles.main}>
        {/* 傳入去重後的 locations */}
        <FilterBar
          locations={uniqueLocations}
          onFilterChange={handleFilterChange}
        />

        <SortBar onSortChange={handleSortChange} />

        <ProductList
          products={filtered}
          favoriteIds={favoriteIds}
          onToggleFavorite={handleToggleFavorite}
          onAddToCart={handleAddToCart}
        />
      </main>
    </div>
  );
}
