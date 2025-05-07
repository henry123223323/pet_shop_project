import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import navstyles from './MainNav.module.css'
import pic from './images/4-2kitcat_tunacrab.png'

const megaData = {
  '/ProductPage': {
    sidebar: [
      { label: '狗狗' },
      { label: '貓咪' },
      { label: '倉鼠' },
      { label: '鳥' }
    ],
    tabs: ['飼料', '副食', '零食', '保健品', '生活家居', '玩具'],
    content: {
      狗狗: {
        飼料: [
          { img: pic, title: '狗狗飼料' },
          { img: pic, title: '狗狗飼料' },
          { img: pic, title: '狗狗飼料' },
          { img: pic, title: '狗狗飼料' },
          { img: pic, title: '狗狗飼料' },
          { img: pic, title: '狗狗飼料' }
        ],
          副食: [
          { img: pic, title: '狗狗副食' },
          { img: pic, title: '狗狗副食' },],
          零食: [
          { img: pic, title: '狗狗零食' },
          { img: pic, title: '狗狗零食' },],
          保健品: [
          { img: pic, title: '狗狗保健品' },
          { img: pic, title: '狗狗保健品' },],
          生活家居: [
          { img: pic, title: '狗狗生活家居' },
          { img: pic, title: '狗狗生活家居' },],
          玩具: [
          { img: pic, title: '狗狗玩具' },
          { img: pic, title: '狗狗玩具' },]
      },
      貓咪: {
        飼料: [
          { img: pic, title: '貓咪飼料' },
          { img: pic, title: '貓咪飼料' },
          { img: pic, title: '貓咪飼料' },
          { img: pic, title: '貓咪飼料' },
          { img: pic, title: '貓咪飼料' },
          { img: pic, title: '貓咪飼料' }
        ],
          副食: [
          { img: pic, title: '貓咪副食' },
          { img: pic, title: '貓咪副食' },],
          零食: [
          { img: pic, title: '貓咪零食' },
          { img: pic, title: '貓咪零食' },],
          保健品: [
          { img: pic, title: '貓咪保健品' },
          { img: pic, title: '貓咪保健品' },],
          生活家居: [
          { img: pic, title: '貓咪生活家居' },
          { img: pic, title: '貓咪生活家居' },],
          玩具: [
          { img: pic, title: '貓咪玩具' },
          { img: pic, title: '貓咪玩具' },]
      },
      倉鼠: {
        飼料: [
          { img: pic, title: '倉鼠飼料' },
          { img: pic, title: '倉鼠飼料' },
          { img: pic, title: '倉鼠飼料' }
        ],
          副食: [
          { img: pic, title: '倉鼠副食' },
          { img: pic, title: '倉鼠副食' },],
          零食: [
          { img: pic, title: '倉鼠零食' },
          { img: pic, title: '倉鼠零食' },],
          保健品: [
          { img: pic, title: '倉鼠保健品' },
          { img: pic, title: '倉鼠保健品' },],
          生活家居: [
          { img: pic, title: '倉鼠生活家居' },
          { img: pic, title: '倉鼠生活家居' },],
          玩具: [
          { img: pic, title: '倉鼠玩具' },
          { img: pic, title: '倉鼠玩具' },]
      },
      鳥: {
        飼料: [
          { img: pic, title: '鳥飼料' }
        ],
          副食: [],
          零食: [
          { img: pic, title: '鳥零食' },
          { img: pic, title: '鳥零食' },],
          保健品: [
          { img: pic, title: '鳥保健品' },
          { img: pic, title: '鳥保健品' },],
          生活家居: [
          { img: pic, title: '鳥生活家居' },
          { img: pic, title: '鳥生活家居' },],
          玩具: [
          { img: pic, title: '鳥玩具' },
          { img: pic, title: '鳥玩具' },]
      },
    }
  },
  '/SeProductPage': {
    sidebar: [
      { label: '狗狗' },
      { label: '貓咪' },
      { label: '倉鼠' },
      { label: '鳥' }
    ],
    tabs: ['產品總覽'],
    content: {
      狗狗: {
        產品總覽: [
          { img: pic, title: '狗狗飼料' },
          { img: pic, title: '狗狗玩具' },
          { img: pic, title: '狗狗飼料' },
          { img: pic, title: '狗狗副食' }
        ]
      },
      貓咪: {
        產品總覽: [
          { img: pic, title: '貓咪飼料' },
          { img: pic, title: '貓咪用品' },
          { img: pic, title: '貓咪飼料' },
          { img: pic, title: '貓咪飼料' },
          { img: pic, title: '貓咪玩具' },
          { img: pic, title: '貓咪飼料' }
        ]
      },
      倉鼠: {
        產品總覽: [
          { img: pic, title: '倉鼠玩具' }
        ]
      },
      鳥: {
        產品總覽: [
          { img: pic, title: '鳥飼料' },
          { img: pic, title: '鳥零食' },
          { img: pic, title: '鳥飼料' },
          { img: pic, title: '鳥飼料' },
          { img: pic, title: '鳥飼料' },
          { img: pic, title: '鳥飼料' }
        ]
      },
    }
  }
};



function MainNav() {
  const [openKey, setOpenKey] = useState(null);
  // 左側選到哪隻寵物
  const [selectedPet, setSelectedPet] = useState(null)
  const [activeTab, setActiveTab] = useState(null);
  // 用一個 state 儲存目前展開的 index，沒展開就是 null
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    if (openKey) {
      const firstPet = megaData[openKey].sidebar[0].label
      const firstTab = megaData[openKey].tabs[0]
      setSelectedPet(firstPet)
      setActiveTab(firstTab)
    }
  }, [openKey])

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
            onMouseEnter={() => setOpenKey(path)}>
            <NavLink to={path}>
              {{ '/ProductPage': '拾毛百貨', '/SeProductPage': '拾毛市場' }[path]}
            </NavLink>

            {openKey === path && (
              <div className={navstyles.megaPanel}
              onMouseLeave={()=>setOpenKey(null)}>
                
                {/* 左側選單 */}
                <aside className={navstyles.sidebar}>
                  <ul>
                    {megaData[path].sidebar.map(item => (
                      <li key={item.label}>
                        <button
                          type="button"
                          className={`${navstyles.sidebarLink}
                               ${selectedPet === item.label ? navstyles.activePet : ''}`}
                          onClick={() => setSelectedPet(item.label)}
                        >
                          {item.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </aside>

                {/* 右側：先 render tabs，再根據 selectedPet＋activeTab 攤平 */}
                <section className={navstyles.content}>
                  <div className={navstyles.tabs}>
                    {megaData[path].tabs.map(tab => (
                      <button
                        key={tab}
                        className={activeTab === tab ? navstyles.activeTab : ''}
                        onClick={() => setActiveTab(tab)}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                  <div className={navstyles.tabPane}>
                    {(
                      // 抓 data
                      (megaData[path].content[selectedPet] || {})[activeTab] || []
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
        {/* ---------------寵物小知識下拉選單div區塊------------------------------ */}
        <li className={navstyles.dropdown}>
          <NavLink to="#">寵物小知識</NavLink>

          <ul className={navstyles.dropdownMenu}>
            {/* 純文字，不做連結，也帶一個 noLink class 方便 CSS 調整 */}
            <li className={navstyles.noLink}><span>知識小文章</span></li>

            <li>
              <NavLink to="/Novicefeeding/dog">新手飼養指南</NavLink>
            </li>
            <li>
              <NavLink to="/HealthCheck/dog">健康檢查篇</NavLink>
            </li>

            <li className={navstyles.noLink}><span>互動小專區</span></li>

            <li>
              <NavLink to="/PartTouch/Touch">部位有話說</NavLink>
            </li>
            <li>
              <NavLink to="/PetQuiz/Quiz">問答知多少</NavLink>
            </li>
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
export default MainNav;
