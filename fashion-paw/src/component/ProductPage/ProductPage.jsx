// src/component/ProductPage/ProductPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './ProductPage.module.css';

import FilterBar from './FilterBar/FilterBar';
import Sidebar   from './SideBar/SideBar';
import SortBar   from './SortBar/SortBar';
import SwitchBtn from './SwitchBtn/SwitchBtn';
import ProductList from './ProductList/ProductList';
import HotRanking  from './HotRanking/HotRanking';

export default function ProductPage() {
  // 既有 state
  const [filters, setFilters]       = useState({ functions: [], brands: [], price: '', hotRanking: '' });
  const [sortBy, setSortBy]         = useState('');
  const [viewMode, setViewMode]     = useState('grid');
  const [products, setProducts]     = useState([]);
  const [displayItems, setDisplay]  = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);

  // 1. 新增 Sidebar 篩選用 state
  const [typeFilter, setTypeFilter]         = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // 初始載入
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get('http://localhost:8000/get/new_product/home');
        res.data.forEach(p => {
          p.images = JSON.parse(p.images);
          p.attributes_object = JSON.parse(p.attributes_object);
          p.created_at = new Date(p.created_at);
          // 中文化 categories...
          switch (p.categories) {
            case 'pet_food':            p.categories = '乾糧'; break;
            case 'complementary_food':  p.categories = '副食'; break;
            case 'snacks':             p.categories = '零食'; break;
            case 'Health_Supplements': p.categories = '保健食品'; break;
            case 'Living_Essentials':  p.categories = '家居'; break;
            case 'toys':               p.categories = '玩具'; break;
            default:                   p.categories = '其他'; break;
          }
        });
        setProducts(res.data);
      } catch (err) {
        console.error('抓資料失敗:', err);
      }
    })();
  }, []);

  // 2. 過濾＋排序＋Sidebar 篩選
  useEffect(() => {
    let items = [...products];

    // --- 先套用 Sidebar 篩選 ---
    if (typeFilter)         items = items.filter(p => p.pet_type === typeFilter);
    if (categoryFilter)     items = items.filter(p => p.categories === categoryFilter);

    // --- 再套用 FilterBar 的篩選 ---
    const { functions: funcs = [], brands = [], price = '', hotRanking = '' } = filters;
    if (funcs.length)       items = items.filter(p => funcs.includes(p.categories));
    if (brands.length)      items = items.filter(p => brands.includes(p.attributes_object.brand));
    if (price) {
      const [min, max] = price.includes('+') 
        ? [Number(price), Infinity] 
        : price.split('-').map(Number);
      items = items.filter(p => p.price >= min && p.price <= max);
    }
    if (hotRanking === 'hot_desc') items.sort((a,b)=>b.hotranking - a.hotranking);
    if (hotRanking === 'hot_asc')  items.sort((a,b)=>a.hotranking - b.hotranking);

    // --- 最後排序 ---
    if (sortBy === 'price_asc')  items.sort((a,b)=>a.price - b.price);
    else if (sortBy === 'price_desc') items.sort((a,b)=>b.price - a.price);
    else if (sortBy === 'createdAt')   items.sort((a,b)=>b.created_at - a.created_at);

    setDisplay(items);
  }, [products, filters, sortBy, typeFilter, categoryFilter]);

  const toggleFav = id => setFavoriteIds(prev =>
    prev.includes(id) ? prev.filter(x=>x!==id) : [...prev, id]
  );
  const addCart = id => console.log('Add to cart', id);

  return (
    <div className={styles.pageWrapper}>
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
            {/* 3. 只帶定義好的 onSelectCategory */}
            <Sidebar onSelectCategory={(type, cat) => {
              setTypeFilter(type);
              setCategoryFilter(cat);
            }} />
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
      <div className={styles.rankingSection}>
        <HotRanking />
      </div>
    </div>
  );
}
