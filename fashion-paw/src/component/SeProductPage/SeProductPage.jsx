import React, { useState, useEffect, useCallback } from 'react';
import styles from './SeProductPage.module.css';
import { useLocation } from 'react-router-dom';

import SideBar from './SideBar/SideBar';
import FilterBar from './FilterBar/FilterBar';
import SortBar from './SortBar/SortBar';
import SwitchBtn from './SwitchBtn/SwitchBtn';
import ProductList from './ProductList/ProductList';
import cookie from 'js-cookie';
import axios from 'axios';

export default function SeProductPage() {
  const location = useLocation();                       // ← 新增
  const searchState = location.state || {};
  const SearchProducts = searchState.products;
  const user_id = cookie.get('user_uid')
  const [viewMode, setViewMode] = useState('grid');
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filters, setFilters] = useState({
    functions: [], price: '', locations: [], depreciation: 0
  });
  const [fliterkey, setfilterkey] = useState(1)
  const [sortBy, setSortBy] = useState('');
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [citytownarray, setcitytownarray] = useState([]);
  const [mapselecttown, setmapselecttown] = useState(null);

  // 載入 mock 資料
  useEffect(() => {
    const fetchData = async () => {
      if (SearchProducts) {
        console.log(typeof (SearchProducts[0].images));
        SearchProducts.forEach(element => {
          element.images = JSON.parse(element.images)
        });
        console.log(typeof (SearchProducts[0].images));

        // 1. 有搜尋結果：直接塞入
        setProducts(SearchProducts);
        setcitytownarray(
          SearchProducts.map(pd => pd.city + pd.district)
        );
      } else {
        // 2. 沒搜尋：去後端抓資料
        try {
          const res = await axios.get('http://localhost:8000/get/second_product/home');
          const data = res.data.map(prod => {
            prod.images = JSON.parse(prod.images);
            prod.attributes_object = JSON.parse(prod.attributes_object);
            prod.new_level = parseInt(prod.new_level);
            prod.created_at = new Date(prod.created_at);
            prod.city = prod.city.replace(/台/g, "臺");
            prod.city_town = prod.city + prod.district;
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
          setcitytownarray(data.map(pd => pd.city_town));
        } catch (err) {
          console.error('抓資料失敗:', err);
        }
      }
    };

    // **⚠️ 這裡要在外層呼叫一次**，才會每次 SearchProducts 變動就執行
    fetchData();
  }, [location.state]);

  useEffect(() => {
    async function fetchData() {
      let favArray = await axios.get(`http://localhost:8000/select/collect/${user_id}/all`)
      setFavoriteIds(favArray.data)
    }
    fetchData()
  }, [user_id, setFavoriteIds])


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
    if (user_id) {

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
      );
    }
    else {
      alert('請先登入!!!')
    }

  };
  const handleAddToCart = id => console.log('Add to cart', id);
  const handleSelectCategory = (t, c) => {
    setSelectedType(t);
    setSelectedCategory(c);
  };
  const doclearsort = () => {
    setfilterkey(prev => prev + 1)
    setmapselecttown(null)
  }
  const uniqueLocations = Array.from(new Set(products.map(p => p.city)));
  let SortProductbyTown = (town) => {
    console.log(town);
    setmapselecttown(town);

  }
  return (
    <div className={styles.container}>
      {/* 1. FilterBar */}
      <div className={styles.filterBar}>
        <FilterBar
          key={fliterkey}
          city_town={citytownarray}
          locations={uniqueLocations}
          onFilterChange={handleFilterChange}
          SortProductbyTown={SortProductbyTown}
        />
      </div>

      <main className={styles.main}>


        <span >{mapselecttown}</span>
        {/* 2. SortBar + SwitchBtn 同列靠右 */}
        <div className={styles.topBar}>
          {/* <button onClick={doclearsort} className='btn btn-outline-primary'>清除篩選</button> */}

          <SortBar onSortChange={handleSortChange} />
          <SwitchBtn viewMode={viewMode} onViewChange={setViewMode} />
        </div>
        <div className={styles.mix}>
          <aside className={styles.sidebar}>
            <SideBar
              selectedType={selectedType}
              onSelectCategory={handleSelectCategory}
            />
          </aside>
          {/* 3. ProductList，傳入 viewMode */}
          <div className={styles.productWrapper}>
            <ProductList
              products={filtered}
              favoriteIds={favoriteIds}
              onToggleFavorite={handleToggleFavorite}
              onAddToCart={handleAddToCart}
              viewMode={viewMode}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
