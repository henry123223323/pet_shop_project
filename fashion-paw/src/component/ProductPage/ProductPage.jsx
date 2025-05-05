// src/component/ProductPage/ProductPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './ProductPage.module.css';

import FilterBar from './FilterBar/FilterBar';
import Sidebar from './SideBar/SideBar';
import SortBar from './SortBar/SortBar';
import SwitchBtn from './SwitchBtn/SwitchBtn';
import ProductList from './ProductList/ProductList';
import HotRanking from './HotRanking/HotRanking';
// import mockProducts from './mockProducts';

export default function ProductPage() {
  // 篩選、排序、顯示模式、資料、收藏
  const [filters, setFilters] = useState({ functions: [], brands: [], price: '', hotRanking: '' });
  const [sortBy, setSortBy] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [products, setProducts] = useState([]);
  const [displayItems, setDisplay] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);

  // 初始載入
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:8000/get/new_product/home');
        res.data.forEach((product, idx) => {
          product.images = JSON.parse(product.images);
          product.attributes_object = JSON.parse(product.attributes_object);
          product.created_at = new Date(product.created_at)

          switch (product.categories) {
            case 'pet_food':
              product.categories = '乾糧'; break
            case 'complementary_food':
              product.categories = '副食'; break
            case 'snacks':
              product.categories = '零食'; break
            case 'Health_Supplements':
              product.categories = '保健食品'; break
            case 'Living_Essentials':
              product.categories = '家居'; break
            case 'toys':
              product.categories = '玩具'; break
            default:
              product.categories = '其他'; break
          }
          console.log(product);


        })
        setProducts(res.data);
      } catch (err) {
        console.error('抓資料失敗:', err);
      }
    };

    fetchData();

  }
    , []);

  // 過濾＋排序邏輯（同上）
  useEffect(() => {
    let items = [...products];
    const { functions: funcs = [], brands = [], price = '', hotRanking = '' } = filters;
    console.log(filters);

    if (funcs.length) items = items.filter(p => funcs.includes(p.categories));
    if (brands.length) items = items.filter(p => brands.includes(p.attributes_object.brand));
    if (price) {
      const [min, max] = price.includes('+')
        ? [Number(price), Infinity]
        : price.split('-').map(Number);
      items = items.filter(p => p.price >= min && p.price <= max);
    }
    if (hotRanking === 'hot_desc') items.sort((a, b) => b.hotranking - a.hotranking);
    if (hotRanking === 'hot_asc') items.sort((a, b) => a.hotranking - b.hotranking);
    if (sortBy === 'price_asc') items.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price_desc') items.sort((a, b) => b.price - a.price);
    else if (sortBy === 'createdAt') items.sort((a, b) => b.created_at - a.created_at);
    setDisplay(items);
  }, [products, filters, sortBy]);

  const toggleFav = id => setFavoriteIds(prev =>
    prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
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
            <Sidebar onSelectCategory={() => { }} />
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
