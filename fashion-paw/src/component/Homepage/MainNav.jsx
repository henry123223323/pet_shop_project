// MainNav.jsx
import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import navstyles from './MainNav.module.css';
import menuData from './data/product.json';   // ← 直接 import 你的 JSON




export default function MainNav() {
  const [openKey, setOpenKey] = useState(null);            // 目前打開的是哪一個 path
  const [selectedPet, setSelectedPet] = useState('');      // 左側選到哪隻寵物
  const [activeTab, setActiveTab] = useState('');          // 右側選到哪個分頁
  const [openIndex, setOpenIndex] = useState(null);
  // 這個就是手風琴要用的資料
  const items = [
    {
      label: '關於好拾毛',
      submenu: [
        { label: '關於我們', to: '/Aboutus' },
        { label: '相關規定', to: '/Help' }
      ]
    },
    {
      label: '拾毛百貨',
      submenu: [
        { label: '狗狗', to: '/Novicefeeding/dog' },
        { label: '貓咪', to: '/HealthCheck/dog' },
        { label: '倉鼠', to: '/PartTouch/Touch' },
        { label: '鳥',   to: '/PetQuiz/Quiz' }
      ]
    },
    {
      label: '拾毛市場',
      submenu: [
        { label: '狗狗', to: '/Novicefeeding/dog' },
        { label: '貓咪', to: '/HealthCheck/dog' },
        { label: '倉鼠', to: '/PartTouch/Touch' },
        { label: '鳥',   to: '/PetQuiz/Quiz' }
      ]
    },
    {
      label: '寵物小知識',
      submenu: [
        { label: '小文章' },
        { label: '新手飼養指南', to: '/Novicefeeding/dog' },
        { label: '健康檢查篇', to: '/HealthCheck/dog' },
        { label: '互動小專區' },
        { label: '部位有話說', to: '/PartTouch/Touch' },
        { label: '問答知多少', to: '/PetQuiz/Quiz' }
      ]
    }
  ];

  // 控制手風琴展開／收起
  const handleClick = (i) => {
    setOpenIndex(openIndex === i ? null : i);
  };
  // 一旦 openKey（路徑）變了，就把左側跟右側都重設到第一筆
  useEffect(() => {
    if (!openKey) return;
    const { sidebar, tabs } = menuData[openKey];
    setSelectedPet(sidebar[0].label);
    setActiveTab(tabs[0]);
  }, [openKey]);

  const pageNames = {
    '/ProductPage': '拾毛百貨',
    '/SeProductPage': '拾毛市場'
  };
  const paths = ['/ProductPage', '/SeProductPage'];

  return (
    <nav className={navstyles.mainNav}>
      <ul className={navstyles.menu}>

        <li className={navstyles.dropdown}>
          <NavLink to="#">關於好拾毛</NavLink>
          <ul className={navstyles.dropdownMenu}>
            <li><NavLink to="/Aboutus">關於我們</NavLink></li>
            <li><NavLink to="/Help">相關法規</NavLink></li>
          </ul>
        </li>

        {paths.map(path => (
          <li key={path}
            className={navstyles.menuItem}
            onMouseEnter={() => setOpenKey(path)}
            onMouseLeave={() => setOpenKey(null)}
          >
            {/* 標題純文字，不連頁 */}
            <span className={navstyles.menuLink}>
              {pageNames[path]}
            </span>

            {/* MegaPanel */}
            {openKey === path && (
              <div className={navstyles.megaPanel}>
                {/* 左側 sidebar */}
                <aside className={navstyles.sidebar}>
                  <ul>
                    {menuData[path].sidebar.map(item => (
                      <li key={item.label}>
                        <button
                          type="button"
                          className={
                            `${navstyles.sidebarLink} ` +
                            `${selectedPet === item.label ? navstyles.activePet : ''}`
                          }
                          onClick={() => setSelectedPet(item.label)}
                        >
                          {item.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </aside>

                {/* 右側 tabs & content */}
                <section className={navstyles.content}>
                  {/* Tabs 列 */}
                  <div className={navstyles.tabs}>
                    {menuData[path].tabs.map(tab => (
                      <button
                        key={tab}
                        className={activeTab === tab ? navstyles.activeTab : ''}
                        onMouseEnter={() => setActiveTab(tab)}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  {/* 內容區：取出 JSON 裡面 content[selectedPet][activeTab] */}
                  <div className={navstyles.tabPane}>
                    {(menuData[path]
                      .content[selectedPet]?.[activeTab] || []
                    ).map((prod, i) => (
                      <div key={i} className={navstyles.card}>
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

        {/* 其他下拉選單不動 */}
        <li className={navstyles.dropdown}>
          <NavLink to="#">寵物小知識</NavLink>
          <ul className={navstyles.dropdownMenu}>
            <li className={navstyles.noLink}><span>知識小文章</span></li>
            <li><NavLink to="/Novicefeeding/dog">新手飼養指南</NavLink></li>
            <li><NavLink to="/HealthCheck/dog">健康檢查篇</NavLink></li>
            <li className={navstyles.noLink}><span>互動小專區</span></li>
            <li><NavLink to="/PartTouch/Touch">部位有話說</NavLink></li>
            <li><NavLink to="/PetQuiz/Quiz">問答知多少</NavLink></li>
          </ul>
        </li>
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
