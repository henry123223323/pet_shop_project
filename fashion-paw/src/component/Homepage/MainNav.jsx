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
  // 用一個 state 儲存目前展開的 index，沒展開就是 null
  const [openIndex, setOpenIndex] = useState(null);

  const items = [
    { label: '關於我們', to: '/Aboutus', submenu: null },
    {
      label: '拾毛百貨', to: '/#',
      submenu: [
        { label: '狗狗', to: '/Novicefeeding/dog' },
        { label: '貓咪', to: '/HealthCheck/dog' },
        { label: '倉鼠', to: '/PartTouch/Touch' },
        { label: '鳥', to: '/PetQuiz/Quiz' }
      ]
    },
    {
      label: '拾毛市場', to: '/#',
      submenu: [
        { label: '狗狗', to: '/Novicefeeding/dog' },
        { label: '貓咪', to: '/HealthCheck/dog' },
        { label: '倉鼠', to: '/PartTouch/Touch' },
        { label: '鳥', to: '/PetQuiz/Quiz' }
      ]
    },
    {
      label: '寵物小知識', to: '/#',
      submenu: [
        { label: '小文章' },
        { label: '新手飼養指南', to: '/Novicefeeding/dog' },
        { label: '健康檢查篇', to: '/HealthCheck/dog' },
        { label: '互動小專區' },
        { label: '部位有話說', to: '/PartTouch/Touch' },
        { label: '寵物知多少', to: '/PetQuiz/Quiz' }
      ]
    }
  ];

  const handleClick = (i) => {
    // 點同一個又關一次，不同就展開新的一個
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <nav className={navstyles.mainNav}>
      <ul className={navstyles.menu}>

        <li><NavLink to="/Aboutus">關於我們</NavLink></li>
        {/* ---------------新品+二手下拉選單div區塊-------------------- */}
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
                '/ProductPage': '拾毛百貨',
                '/SeProductPage': '拾毛市場'
              }[path]}
            </NavLink>
            {megaData[path] && openKey === path && (
              <div className={navstyles.megaPanel}>
                {/* 左側子分類 */}
                <aside className={navstyles.sidebar}>
                  <ul>
                    {megaData[path].sidebar.map((item, idx) => (
                      <li key={`${item.to}-${idx}`}>
                        <NavLink to={item.to}>
                          <img src={item.icon} alt={item.label} />
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
        {/* ---------------寵物小知識下拉選單div區塊------------------------------ */}
        <li className={navstyles.dropdown}><NavLink to="#">寵物小知識</NavLink>
          <ul className={navstyles.dropdownMenu}>
            <li>知識小文章</li>
            <li><NavLink to="/Novicefeeding/dog">新手飼養指南</NavLink></li>
            <li><NavLink to="/HealthCheck/dog">健康檢查篇</NavLink></li>
            <li>互動小專區</li>
            <li><NavLink to="/PartTouch/Touch">部位有話說</NavLink></li>
            <li><NavLink to="/PetQuiz/Quiz">問答知多少</NavLink></li>
          </ul></li>
      </ul>
      {/* 手風琴的下拉式選單 */}
      <ul className={navstyles.accordionMenu}>
        {items.map((item, i) => (
          <li key={i}>
            <div
              className={navstyles.header}
              onClick={() => item.submenu && handleClick(i)}
            >
              {item.submenu
                ? <span className={navstyles.headerText}>{item.label}</span>
                : <NavLink to={item.to}>{item.label}</NavLink>
              }
              {item.submenu && (
                <span className={navstyles.arrow}>
                  {openIndex === i ? '▾' : '▸'}
                </span>
              )}
            </div>
            {item.submenu && openIndex === i && (
              <ul className={navstyles.submenu}>
                {item.submenu.map((sub, j) => (
                  <li key={j}>
                    {sub.to
                      ? <NavLink to={sub.to}>{sub.label}</NavLink>
                      : <span className={navstyles.noLink}>{sub.label}</span>
                    }
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>

  );
}
export default MainNav;
