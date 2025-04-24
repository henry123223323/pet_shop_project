import React, { useState } from 'react';
import styles from './Sidebar.module.css';

export default function Sidebar() {
  // expandedType 存放目前展開的是哪個區域（'dog' or 'cat' or null）
  const [expandedType, setExpandedType] = useState(null);

  const toggleType = (type) => {
    setExpandedType(prev => (prev === type ? null : type));
  };

  return (
    <div className={styles.sidebar}>
        <ul className={styles.menu}>
          <li>
            <button
              className='paw-bg-primary'
              onClick={() => toggleType('dog')}
            >
              <span className= 'paw-bg-primary'>
              狗狗專區{expandedType === 'dog' ? '▾' : '▸'}
              </span>
            </button>
            {expandedType === 'dog' && (
              <ul className={styles.sublist}>
                <li><label><input type="checkbox" /> 飼料</label></li>
                <li><label><input type="checkbox" /> 副食</label></li>
                <li><label><input type="checkbox" /> 零食</label></li>
                <li><label><input type="checkbox" /> 保健食品</label></li>
                <li><label><input type="checkbox" /> 家居</label></li>
                <li><label><input type="checkbox" /> 玩具</label></li>
              </ul>
            )}
          </li>
          <li>
            <button
              className='paw-bg-primary'
              onClick={() => toggleType('cat')}
            >
              <span className='paw-bg-primary'>
              貓貓專區{expandedType === 'cat' ? '▾' : '▸'}
              </span>
            </button>
            {expandedType === 'cat' && (
              <ul className={styles.sublist}>
                <li><label><input type="checkbox" /> 飼料</label></li>
                <li><label><input type="checkbox" /> 副食</label></li>
                <li><label><input type="checkbox" /> 零食</label></li>
                <li><label><input type="checkbox" /> 保健食品</label></li>
                <li><label><input type="checkbox" /> 家居</label></li>
                <li><label><input type="checkbox" /> 玩具</label></li>
              </ul>
            )}
          </li>
          <button
              className='paw-bg-primary'
              onClick={() => toggleType('bird')}
            >
              <span className='paw-bg-primary'>
              鳥類專區{expandedType === 'bird' ? '▾' : '▸'}
              </span>
            </button>
            {expandedType === 'bird' && (
              <ul className={styles.sublist}>
                <li><label><input type="checkbox" /> 飼料</label></li>
                <li><label><input type="checkbox" /> 副食</label></li>
                <li><label><input type="checkbox" /> 零食</label></li>
                <li><label><input type="checkbox" /> 保健食品</label></li>
                <li><label><input type="checkbox" /> 家居</label></li>
                <li><label><input type="checkbox" /> 玩具</label></li>
              </ul>
            )}
            <button
              className='paw-bg-primary'
              onClick={() => toggleType('mouse')}
            >
              <span className='paw-bg-primary'>
              老鼠專區{expandedType === 'mouse' ? '▾' : '▸'}
              </span>
            </button>
            {expandedType === 'mouse' && (
              <ul className={styles.sublist}>
                <li><label><input type="checkbox" /> 飼料</label></li>
                <li><label><input type="checkbox" /> 副食</label></li>
                <li><label><input type="checkbox" /> 零食</label></li>
                <li><label><input type="checkbox" /> 保健食品</label></li>
                <li><label><input type="checkbox" /> 家居</label></li>
                <li><label><input type="checkbox" /> 玩具</label></li>
              </ul>
            )}
        </ul>
    </div>
  );
}
