// Homepage.jsx
import React, { useState, useEffect } from 'react';
import NewsBar from './NewsBar';
import Banner from './Banner';
import SectionLinks from './SectionLinks.jsx';
import CategoryIcons from './CategoryIcons';
import BestsellerTabs from './BestsellerTabs';
import NewsEventsSection from './NewsEventsSection';
import InfoSection from './InfoSection';

// 請把這兩張圖放到 public/images 或你的資源目錄
import goTopIcon from './images/Logo.png';
import chatIcon from './images/Logo.png';


function Homepage() {
  // 控制顯示 "Go to Top" & 聊天室按鈕
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowButtons(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openChat = () => {
    // TODO: 替換為聊天室邏輯
    alert('開啟聊天室');
  };

  return (
    <>
      <NewsBar />
      <SectionLinks />
      <CategoryIcons />
      <BestsellerTabs />
      <NewsEventsSection />
      <InfoSection />

      {/* 固定在右下角的按鈕群 */}
      {showButtons && (
        <div
          style={{
            position: 'fixed',
            bottom: '1rem',
            right: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            zIndex: 2000,
          }}
        >
          <img
            src={goTopIcon}
            alt="Go to top"
            style={{ width: '48px', height: '48px', cursor: 'pointer' }}
            onClick={scrollToTop}
          />
          <img
            src={chatIcon}
            alt="Chat"
            style={{ width: '48px', height: '48px', cursor: 'pointer' }}
            onClick={openChat}
          />
        </div>
      )}
    </>
  );
}

export default Homepage;
