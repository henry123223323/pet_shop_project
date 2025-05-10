// SearchBar.jsx
import React, { useState, useRef, useEffect } from 'react';
import styles from './SearchBar.module.css';
import { ReactComponent as SearchIcon } from './images/search.svg'; // 你的搜尋 icon
import axios from 'axios';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
const categories = ['新品', '二手'];


function SearchBar({ onSearch }) {
  const [open, setOpen] = useState(false);
  const inputRef = useRef();
  // 目前選到哪個分類，預設就是第一個
  const [category, setCategory] = useState(categories[0]);
  // 使用者打的關鍵字
  const [keyword, setKeyword] = useState('');
  const history = useHistory()
  // 當 open 變為 true 時，自動聚焦到 input
  useEffect(() => {
    if (open) inputRef.current.focus();
  }, [open]);

  const handleSubmit = async e => {
    e.preventDefault();

    if (!open) {
      setOpen(true);
      return;
    }

    if (!keyword.trim()) {
      // 1) 如果沒輸入任何東西，就收起搜尋列
      // setOpen(false);
    } else {
      if (category === '新品') {
        let search_result = await axios.post('http://localhost:8000/post/productsreach/new', { keyword: keyword })
        console.log(search_result.data);
        history.push({
          pathname: '/ProductPage',
          state: {
            products: search_result.data,
          }
        });
      }
      else {
        let search_result = await axios.post('http://localhost:8000/post/productsreach/second', { keyword: keyword })
        console.log(search_result.data);
        history.push({
          pathname: '/SeProductPage',
          state: {
            products: search_result.data,
          }
        });
      }
      // 2) 如果有輸入關鍵字，就跑 alert（或呼叫 onSearch）
      alert(`你搜尋了：${keyword}（分類：${category}）`);
    }
  };

  return (
    <form className={styles.wrapper}
      onSubmit={handleSubmit}>

      {open && (
        <>
          <select
            className={styles.select}
            value={category}
            onChange={e => setCategory(e.target.value)}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <input
            ref={inputRef}
            className={styles.input}
            type="text"
            placeholder="搜尋商品…"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
          />
        </>
      )}
      <button
        type="submit"
        className={styles.button}
        aria-label={open ? 'Submit search' : 'Toggle search'}
        onClick={() => { if (!open) setOpen(true); }}
      >
        <SearchIcon className={styles.svgIcon} />
      </button>
    </form>
  );
}
export default SearchBar;
