import React, { useEffect, useState } from 'react';
import goTopIcon from './images/Vector.svg'
import chatIcon from './images/chatbot.png'

function Icon() {
    const [showGoTop, setShowGoTop] = useState(false)

    useEffect(() => {
        const onScroll = () => setShowGoTop(window.scrollY > 500)
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    const scrollToTop = () =>
        window.scrollTo({ top: 0, behavior: 'smooth' })

    const openChat = () =>
        alert('開啟聊天室惹～')

    return (
        <>
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
                {/* 1. GoTop 按鈕：只有滑超過 500px 才顯示 */}
                <img
                    src={chatIcon}
                    alt="Chat"
                    style={{ width: 80, height: 80, cursor: 'pointer' }}
                    onClick={openChat}
                />
                {showGoTop && (
                    <img
                        src={goTopIcon}
                        alt="Go to top"
                        style={{ width: 30, height: 30, cursor: 'pointer' }}
                        onClick={scrollToTop}
                    />
                )}
                {/* 2. Chat 按鈕：永遠顯示 */}

            </div>
        </>
    )
}
export default Icon;