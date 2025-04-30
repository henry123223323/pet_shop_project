import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import navstyles from './MainNav.module.css'


const megaData = {
  '/ProductPage': {
    sidebar: [
      { label: '狗狗', icon: '/feather 1.svg', to: '/new/Dog' },
      { label: '貓咪', icon: '/feather 1.svg', to: '/second/snack' },
      { label: '倉鼠', icon: '/icons/toy.svg', to: '/second/toy' },
      { label: '鳥', icon: '/icons/toy.svg', to: '/second/toy' }
      // …
    ],
    tabs: ['飼料', '副食', '零食', '保健品', '生活家居', '玩具'],
    content: {
      飼料: [ /* 圖片＋名稱陣列 */],
      副食: [ /* … */],
      零食: [ /* … */],
      保健品: [ /* … */],
      生活家居: [ /* … */],
      玩具: [ /* … */]
    }
  },
  '/SeProductPage': {
    sidebar: [
      { label: '狗狗', icon: '/feather 1.svg', to: '/new/Dog' },
      { label: '貓咪', icon: '/feather 1.svg', to: '/second/snack' },
      { label: '倉鼠', icon: '/icons/toy.svg', to: '/second/toy' },
      { label: '鳥', icon: '/icons/toy.svg', to: '/second/toy' }
      // …
    ],
    tabs: ['飼料', '副食', '零食', '保健品', '生活家居', '玩具'],
    content: {
      飼料: [ /* 圖片＋名稱陣列 */],
      副食: [ /* … */],
      零食: [ /* … */],
      保健品: [ /* … */],
      生活家居: [ /* … */],
      玩具: [ /* … */]
    }
  }
  // 如果其他主選項也要 mega，就再加一筆
};



function MainNav() {
  const [openKey, setOpenKey] = useState(null);
  const [activeTab, setActiveTab] = useState(null);
  

  return (
    <nav className={navstyles.mainNav}>
      <ul className={navstyles.menu}>
        <li><NavLink to="/Aboutus">關於我們</NavLink></li>
        {/* --------------------------------------------------- */}
        {['/ProductPage', '/SeProductPage'].map(path => (
          <li key={path}
            className={navstyles.menuItem}
            onMouseEnter={() => {
              setOpenKey(path);
              setActiveTab(megaData[path].tabs[0]);
            }}
            
            // onMouseEnter={() => setOpenKey(path)}
            onMouseLeave={() => setOpenKey(null)}>
            <NavLink to={path}>
              {{
                '/ProductPage': '新品專區',
                '/SeProductPage': '二手專區'
              }[path]}
            </NavLink>
            {megaData[path] && openKey === path && (
              <div className={navstyles.megaPanel}>
                {/* 左側子分類 */}
                <aside className={navstyles.sidebar}>
                  <ul>
                    {megaData[path].sidebar.map(item => (
                      <li key={item.to}>
                        <NavLink to={item.to}>
                          <img src={item.icon} alt="" />
                          <span>{item.label}</span>
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </aside>

                {/* 右側標籤＋內容 */}
                <section className={navstyles.content}>
                  <div className={navstyles.tabs}>
                    {megaData[path].tabs.map(tab => (
                      <button
                        key={tab}
                        className={activeTab === tab ? navstyles.activeTab : ''}
                        onMouseEnter={() => setActiveTab(tab)}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                  <div className={navstyles.tabPane}>
                    {(megaData[path].content[activeTab] || [])
                      .map((prod, i) => (
                        <div key={i} className={navstyles.card}>
                          {/* 假設 prod 物件有 img & title */}
                          <img src={prod.img} alt={prod.title} />
                          <p>{prod.title}</p>
                        </div>
                      ))}
                  </div>
                </section>
              </div>
            )}
          </li>
        ))}
        {/* ------------------------------------------------------------------------ */}
        <li className={navstyles.dropdown}><NavLink to="/knowledge">寵物小知識</NavLink>
          <ul className={navstyles.dropdownMenu}>
            <li>知識小文章</li>
            <li><NavLink to="/second/food">新手飼養指南</NavLink></li>
            <li><NavLink to="/second/food">健康檢查篇</NavLink></li>
            <li>互動小專區</li>
            <li><NavLink to="/second/food">部位有話說</NavLink></li>
            <li><NavLink to="/second/food">問答知多少</NavLink></li>
          </ul></li>

        {/* <li className={navstyles.dropdown}>
          <NavLink to="/new">新品專區</NavLink>
          <ul className={navstyles.dropdownMenu}>
            <li><NavLink to="/second/food">狗狗</NavLink></li>
            <li><NavLink to="/second/food">貓咪</NavLink></li>
            <li><NavLink to="/second/food">倉鼠</NavLink></li>
            <li><NavLink to="/second/food">鳥</NavLink></li>
          </ul>
        </li>

        <li><NavLink to="/second">二手專區</NavLink></li>

        <li className={navstyles.dropdown}><NavLink to="/knowledge">寵物小知識</NavLink>
          <ul className={styles.dropdownMenu}>
            <li>知識小文章</li>
            <li><NavLink to="/second/food">新手飼養指南</NavLink></li>
            <li><NavLink to="/second/food">健康檢查篇</NavLink></li>
            <li>互動小專區</li>
            <li><NavLink to="/second/food">部位有話說</NavLink></li>
            <li><NavLink to="/second/food">問答知多少</NavLink></li>
          </ul></li> */}
      </ul>




    </nav>
  );
}
export default MainNav;
