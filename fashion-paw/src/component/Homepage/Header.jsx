import React, { useState, useEffect } from 'react';
import MainNav from './MainNav'
import { Link } from "react-router-dom";
import { BiMenu, BiX } from 'react-icons/bi'; // 安裝 react-icons
import Logo from "./images/Logo.png"
import styles from './IndexStyle.module.css'
import navstyles from './MainNav.module.css'

function Header() {
    // 設隱藏導覽列的初始值
    const [hideHeader, setHideHeader] = useState(false);
    // 向下滑動隱藏導覽列初始值
    const [lastScrollY, setLastScrollY] = useState(0);
    // 螢幕縮小到768px得時候變成漢堡選單，點擊打開的初始值
    const [openMobileNav, setOpenMobileNav] = useState(false);

    // 向下滑隱藏導覽列的判斷
    useEffect(() => {
        const handleScroll = () => {
            const currentY = window.scrollY;
            if (currentY > lastScrollY && currentY > 100) {
                // 往下滾超過 100px，就隱藏
                setHideHeader(true);
            } else {
                // 往上滾就顯示
                setHideHeader(false);
            }
            setLastScrollY(currentY);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    return (
        <>
            {/* 縮到768px出現漢堡選單 */}
            <div
                // 打開時顯示遮罩
                className={`${navstyles.navOverlay} ${openMobileNav ? navstyles.open : ''}`}
                // click漢堡選單時初始值為false
                onClick={() => setOpenMobileNav(false)}
            />
            {/* ----Header----- */}
            <header className={[
                styles.header,
                hideHeader ? styles.hiddenHeader : ""
            ].join(' ')}
            >

                {/* 漢堡按鈕icon */}
                <button
                    className={styles.hamburger}
                    // v是函式式更新的寫法，OpenMobileNav傳回false，v就是false，!v是true，反之。v變數名稱可以換。
                    onClick={() => setOpenMobileNav(v => !v)}
                >
                    {/* openMobileNav 是條件（布林值），如果它是 true，則會回傳並渲染 <BiX />（叉叉圖示），如果它是 false，則會回傳並渲染 <BiMenu />（漢堡選單圖示） */}
                    {/* {openMobileNav ? <BiX /> : <BiMenu />} */}
                    <BiMenu />
                </button>

                {/* header第一列 */}
                <div className={styles.headerTop}>
                    <button className={styles.iconBtn}><i className="bi bi-search"></i></button>
                    <button className={styles.iconBtn}><i className="bi bi-cart"></i></button>
                    <Link to="/Login" className={styles.link}>登入</Link>
                    <span>|</span>
                    <Link to="/Register" className={styles.link}>註冊</Link>
                </div>
                {/* header第二列Logo */}
                <div className={styles.headerLogo}>
                    <Link to="/"><img src={Logo} alt="Logo" style={{ height: 100 }} /></Link>
                </div>
                {/* header第三列nav */}
                <div className={styles.mainNav}><MainNav /></div>

            </header>

            {/* Drawer：側邊欄，裡面包 MainNav */}
            <div className={`${navstyles.drawer} ${openMobileNav ? navstyles.open : ''}`}>
                <button className={navstyles.closeBtn}
                    onClick={() => setOpenMobileNav(false)}>
                    <BiX />
                </button>
                <MainNav />
                <div className={navstyles.accountSection}>
                    <h3>帳戶</h3>
                    <ul className={navstyles.accountList}>
                        <li><Link to="/Login">會員登入</Link></li>
                        <li><Link to="/Register">註冊新會員</Link></li>
                    </ul>
                </div>
            </div>
        </>
    );
}
export default Header;
