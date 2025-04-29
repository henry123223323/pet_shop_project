import React, { useState, useEffect } from 'react';
import MainNav from './MainNav'
import { Link } from "react-router-dom";
import Logo from "./images/Logo.png"
import styles from './IndexStyle.module.css'

function Header() {

    // scrolled: 是否已經滑動過 threshold
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // 當捲動超過 100px 就切換到「黏貼＋一列」模式
            setScrolled(window.scrollY > 300);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (scrolled) {
        // 切換到「一列＋黏在上面」的版型
        return (
            <header className={styles.stickyHeader}>
                <Link to="/">
                    <img src={Logo} alt="好拾毛 Logo" className={styles.logoSmall} />
                </Link>
                <MainNav />
                <div className={styles.iconGroup}>
                    <button className={styles.iconBtn}><i className="bi bi-search" /></button>
                    <button className={styles.iconBtn}><i className="bi bi-cart" /></button>
                    <Link to="/Login">登入</Link><span>｜</span><Link to="/Register">註冊</Link>
                </div>
                
            </header>
        );
    }

    return (
        <header className={`${styles.header} container-xxl`}>
            <div className={styles.headerTop}>
                <button className={styles.iconBtn}><i className="bi bi-search"></i></button>
                <button className={styles.iconBtn}><i className="bi bi-cart"></i></button>
                <Link to="/Login" className={styles.link}>登入</Link><span>|</span><Link to="/Register" className={styles.link}>註冊</Link>
            </div>
            <div className={styles.headerLogo}>
                <Link to='/'>
                    <img src={Logo} alt="好拾毛logo" style={{ height: 100 }} />
                </Link>
            </div>

            <MainNav />
        </header>
    )
}
export default Header;
