// Icon.jsx
import React, { useEffect, useState } from 'react'
import goTopIcon from './images/Vector.svg'
import chatIcon from './images/chatbot.png'
import ChatWidget from '../chatroom/ChatWindow' // 你的聊天室主體

export default function Icon() {
  const [showGoTop, setShowGoTop] = useState(false)
  const [showChat, setShowChat] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowGoTop(window.scrollY > 500)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToTop = () =>
    window.scrollTo({ top: 0, behavior: 'smooth' })

  // 切換聊天視窗
  const toggleChat = () =>
    setShowChat(prev => !prev)

  return (
    <>
      {/* 底下圖示 */}
      <div style={{
        position: 'fixed',
        bottom: '1rem',
        right: '1rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
        zIndex: 2000,
      }}>
        {/* 貓咪按鈕 */}
        <img
          src={chatIcon}
          alt="Chat"
          style={{ width: 80, height: 80, cursor: 'pointer' }}
          onClick={toggleChat}
        />

        {/* 回頂端 */}
        {showGoTop && (
          <img
            src={goTopIcon}
            alt="Go to top"
            style={{ width: 30, height: 30, cursor: 'pointer' }}
            onClick={scrollToTop}
          />
        )}
      </div>

      {/* 聊天室滑入面板 */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: showChat ? 0 : '-100%',
        width: '300px',
        height: '400px',
        background: '#fff',
        boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
        transition: 'left 0.3s ease',
        zIndex: 1500,
      }}>
        <ChatWidget />
      </div>
    </>
  )
}
