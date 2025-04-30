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
            <div
                className={`${navstyles.navOverlay} ${openMobileNav ? navstyles.open : ''}`}
                onClick={() => setOpenMobileNav(false)}
            />
            {/* ---------------- */}
            <header className={[
                styles.header,
                hideHeader ? styles.hiddenHeader : "",
                'container-xxl'
            ].join(' ')}>
                <button
                    className={styles.hamburger}
                    onClick={() => setOpenMobileNav(v => !v)}
                >
                    {openMobileNav ? <BiX /> : <BiMenu />}
                </button>

                <div className={styles.headerTop}>
                    <button className={styles.iconBtn}><i className="bi bi-search"></i></button>
                    <button className={styles.iconBtn}><i className="bi bi-cart"></i></button>
                    <Link to="/Login" className={styles.link}>登入</Link>
                    <span>|</span>
                    <Link to="/Register" className={styles.link}>註冊</Link>
                </div>

                <div className={styles.headerLogo}>
                    <Link to="/"><img src={Logo} alt="Logo" style={{ height: 100 }} /></Link>
                </div>

                {/* <div className={`${styles.mainNavWrapper} ${openMobileNav ? styles.open : ''}`}>
                <MainNav />
            </div> */}
                <div
                    className={`${navstyles.drawer} ${openMobileNav ? navstyles.open : ''}`}
                >
                    <MainNav />
                </div>

            </header>
        </>
    );
}

// return (
//     <header className={`${styles.header} container-xxl`}>
//         <div className={styles.headerTop}>
//             <button className={styles.iconBtn}><i className="bi bi-search"></i></button>
//             <button className={styles.iconBtn}><i className="bi bi-cart"></i></button>
//             <Link to="/Login" className={styles.link}>登入</Link><span>|</span><Link to="/Register" className={styles.link}>註冊</Link>
//         </div>
//         <div className={styles.headerLogo}>
//             <Link to='/'>
//                 <img src={Logo} alt="好拾毛logo" style={{ height: 100 }} />
//             </Link>
//         </div>

//         <MainNav />
//     </header>
// )
// }
export default Header;
