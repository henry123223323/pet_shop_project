import React, { useState, useEffect } from 'react';
// import axios from 'axios'; 先不用 axios，先註解掉
import styles from './ProductPage.module.css';

// Components
import Sidebar from './Sidebar/Sidebar';
import FilterBar from './FilterBar/FilterBar';
import SortBar from './SortBar/SortBar';
import ProductList from './ProductList/ProductList';
import HotRanking from './HotRanking/HotRanking';

// Mock Data
import mockProducts from './mockProducts'; // ⭐ 引入你的假資料

export default function ProductPage() {
  // ---------------------------------------------
  //  State 區塊
  // ---------------------------------------------
  const [products, setProducts] = useState([]);      
  const [filtered, setFiltered] = useState([]);      
  const [filters, setFilters] = useState({          
    functions: [],
    brands: [],
    price: ''
  });
  const [sortBy, setSortBy] = useState('');      
  const [favoriteIds, setFavoriteIds] = useState([]);      
  const [selectedType, setSelectedType] = useState(null);  
  const [selectedCategory, setSelectedCategory] = useState(null); 

  // ---------------------------------------------
  //  第一次掛載：載入假資料
  // ---------------------------------------------
  useEffect(() => {
    // ✅ 這邊改成直接用假資料
    setProducts(mockProducts);
  }, []);

  // ---------------------------------------------
  // 📦 根據 filters、sortBy、類型分類做商品過濾 + 排序
  // ---------------------------------------------
  useEffect(() => {
    let result = [...products];
    const { functions, brands, price } = filters;

    if (selectedType) {
      result = result.filter(p => p.pet_type === selectedType);
    }

    if (selectedCategory) {
      result = result.filter(p => p.category === selectedCategory);
    }

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
  // 🔁處理 filter 與 sort 傳回的 callback
  // ---------------------------------------------
  const handleFilterChange = newFilters => setFilters(newFilters);
  const handleSortChange = sortKey => setSortBy(sortKey);

  // ---------------------------------------------
  //  收藏 / 🛒 加入購物車
  // ---------------------------------------------
  const handleToggleFavorite = id => {
    setFavoriteIds(prev =>
      prev.includes(id) ? prev.filter(favId => favId !== id) : [...prev, id]
    );
  };

  const handleAddToCart = id => {
    console.log(`加入購物車 id=${id}`);
    // 可以接後端購物車 API
  };

  // ---------------------------------------------
  //  處理 Sidebar 點選分類
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
        <Sidebar onSelectCategory={handleSelectCategory} />
      </aside>

      <main className={styles.main}>
        <FilterBar onFilterChange={handleFilterChange} />
        <SortBar onSortChange={handleSortChange} />

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
