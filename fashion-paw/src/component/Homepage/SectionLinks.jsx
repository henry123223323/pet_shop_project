// src/component/Homepage/SectionLinks.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './SectionLinks.module.css';

import newImg from './images/newpd.png';
import usedImg from './images/newpd2.png';

const sections = [
  { key: 'new',   label: '新品', to: '/ProductPage',   src: newImg  },
  { key: 'used',  label: '二手', to: '/SeProductPage',src: usedImg },
];

export default function SectionLinks() {
  return (
    <div className="container-lg mt-5">
      <div className="row gx-4">
        {sections.map(sec => (
          <div key={sec.key} className="col-6 col-md-6 mb-4">
            <Link to={sec.to} className={styles.link}>
              <div className={styles.card}>
                <img
                  src={sec.src}
                  alt={sec.label}
                  className="img-fluid"
                />
                <div className={styles.caption}>
                  {sec.label}
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
