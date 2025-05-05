// src/component/SeProductPage/SeProductPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import styles from './SeProductPage.module.css';

import SideBar from './SideBar/SideBar';
import FilterBar from './FilterBar/FilterBar';
import SortBar from './SortBar/SortBar';
import SwitchBtn from './SwitchBtn/SwitchBtn';
import ProductList from './ProductList/ProductList';

import axios from 'axios';

export default function SeProductPage() {
  const [viewMode, setViewMode] = useState('grid');
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filters, setFilters] = useState({
    functions: [], price: '', locations: [], depreciation: 0
  });
  const [sortBy, setSortBy] = useState('');
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [citytownarray, setcitytownarray] = useState([]);
  const [mapselecttown, setmapselecttown] = useState(null);

  // 載入 mock 資料
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:8000/get/second_product/home');
        res.data.forEach((product, idx) => {
          product.images = JSON.parse(product.images);
          product.attributes_object = JSON.parse(product.attributes_object);
          product.new_level = parseInt(product.new_level)
          product.created_at = new Date(product.created_at)
          product.city = product.city.replace(/台/g, "臺")
          product.city_town = product.city + product.district
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
        let array = []

        array = res.data.map(pd => pd.city_town); // 用剛抓到的資料
        setcitytownarray(array);
        console.log(array);


      } catch (err) {
        console.error('抓資料失敗:', err);
      }
    };

    fetchData();

  }
    , []);


  // 過濾 + 排序
  useEffect(() => {
    let result = [...products];

    // 解構並給預設值，避免未定義
    const {
      functions = [],
      price = '',
      locations = [],
      depreciation = 0
    } = filters;

    // 類型＆分類
    if (selectedType) result = result.filter(p => p.pet_type === selectedType);
    if (selectedCategory) result = result.filter(p => p.category === selectedCategory);

    // 價格篩選
    if (price) {
      const [min, max] = price.includes('+')
        ? [Number(price), Infinity]
        : price.split('-').map(Number);
      result = result.filter(p => p.price >= min && p.price <= max);
    }
    if (mapselecttown) {
      result = result.filter(p => p.city_town === mapselecttown)
    }
    // 功能篩選
    if (functions.length > 0) {
      result = result.filter(p => functions.includes(p.function));
    }

    // 地點篩選
    if (locations.length > 0) {
      result = result.filter(p => locations.includes(p.city));
    }

    // 折舊程度
    if (depreciation) {
      result = result.filter(p => p.new_level === depreciation);
    }

    // 排序
    if (sortBy === 'price_asc') result.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price_desc') result.sort((a, b) => b.price - a.price);
    else if (sortBy === 'createdAt') result.sort((a, b) =>
      b.created_at - a.created_at
    );
    else if (sortBy === 'hotranking') result.sort((a, b) => b.hotranking - a.hotranking);

    setFiltered(result);
  }, [
    products,
    filters,            // 監聽整個 filters 物件
    sortBy,
    selectedType,
    selectedCategory,
    mapselecttown
  ]);

  const handleFilterChange = useCallback(nf => setFilters(nf), []);
  const handleSortChange = sk => setSortBy(sk);
  const handleToggleFavorite = id => {
    setFavoriteIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };
  const handleAddToCart = id => console.log('Add to cart', id);
  const handleSelectCategory = (t, c) => {
    setSelectedType(t);
    setSelectedCategory(c);
  };

  const uniqueLocations = Array.from(new Set(products.map(p => p.city)));
  let SortProductbyTown = (town) => {
    console.log(town);
    setmapselecttown(town);

  }
  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <SideBar onSelectCategory={handleSelectCategory} />
      </aside>

      <main className={styles.main}>
        {/* 1. FilterBar */}
        <div className={styles.filterBar}>
          <FilterBar
            city_town={citytownarray}
            locations={uniqueLocations}
            onFilterChange={handleFilterChange}
            SortProductbyTown={SortProductbyTown}
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
