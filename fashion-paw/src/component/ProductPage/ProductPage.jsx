// src/component/ProductPage/ProductPage.jsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import styles from './ProductPage.module.css';
import cookie from "js-cookie";

import FilterBar from './FilterBar/FilterBar';
import Sidebar from './SideBar/SideBar';
import SortBar from './SortBar/SortBar';
import SwitchBtn from './SwitchBtn/SwitchBtn';
import ProductList from './ProductList/ProductList';
import HotRanking from './HotRanking/HotRanking';
// import mockProducts from './mockProducts';

export default function ProductPage() {
  const user_id = cookie.get('user_uid')

  const location = useLocation();                     // ← 拿到 location
  const searchState = location.state || {};
  const searchProducts = searchState.products;
  // 篩選、排序、顯示模式、資料、收藏
  const [filters, setFilters] = useState({ functions: [], brands: [], price: '', hotRanking: '' });
  const [sortBy, setSortBy] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [products, setProducts] = useState([]);
  const [displayItems, setDisplay] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);

  useEffect(() => {
    async function fetchData() {
      let favArray = await axios.get(`http://localhost:8000/select/collect/${user_id}/all`)
      setFavoriteIds(favArray.data)
    }
    fetchData()
  }, [user_id, setFavoriteIds])
  // 初始載入
  useEffect(() => {
    if (searchProducts) {
      // 有搜尋結果就直接用
      setProducts(searchProducts);
    } else {
      // 否則才呼叫後端撈「最新商品」
      axios.get('http://localhost:8000/get/new_product/home')
        .then(res => {
          const data = res.data.map(prod => {
            prod.images = JSON.parse(prod.images);
            prod.attributes_object = JSON.parse(prod.attributes_object);
            prod.created_at = new Date(prod.created_at);
            // categories 中文化
            switch (prod.categories) {
              case 'pet_food': prod.categories = '乾糧'; break;
              case 'complementary_food': prod.categories = '副食'; break;
              case 'snacks': prod.categories = '零食'; break;
              case 'Health_Supplements': prod.categories = '保健食品'; break;
              case 'Living_Essentials': prod.categories = '家居'; break;
              case 'toys': prod.categories = '玩具'; break;
              default: prod.categories = '其他'; break;
            }
            return prod;
          });
          setProducts(data);
        })
        .catch(err => console.error('抓資料失敗:', err));
    }
  }, [searchProducts]);

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

  const toggleFav = (id) => {
    if (favoriteIds.includes(id)) {
      //delete api
      axios.get(`http://localhost:8000/delete/collect/${user_id}/${id}`)

    }
    else {
      //insert api
      axios.get(`http://localhost:8000/insert/collect/${user_id}/${id}`)

    }

    setFavoriteIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  };
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
