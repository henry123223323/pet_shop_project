// src/component/PetKnowledge/NewsEventsSection.jsx
import React, { useState, useEffect } from 'react';
import styles from './NewsEventsSection.module.css';
import pawicon from './images/pawicon.svg'
import ttt from'./images/Dog7.jpg'

const mockEvents= [
  { id: 1, title: '🐶 寵物健康講座報名開放中', date:'2025/05/19', img:ttt },
  { id: 2, title: '🐱 貓咪美容工作坊',       date:'2025/06/02', img:ttt },
  { id: 3, title: '🐰 兔兔訓練小教室',       date:'2025/06/15', img:ttt }
];


export default function NewsEventsSection() {
  const [events, setEvents] = useState([]);
  useEffect(() => {
    setEvents(mockEvents);
  }, []);

  return (
    <section className="container-lg" id='newsEvents'>
      <div className={styles.headerWrapper}>
        <h2 className={styles.title}>
          活動快報 <img src={pawicon} className={styles.icon}/>
        </h2>
      </div>
      <div className="row">
        {events.map(e => (
          <div key={e.id} className="col-6 col-md-4 mb-4">
            <div className={styles.card}>
              <div className={styles.imageWrapper}>
                <img src={e.img} alt={e.title} className={styles.image}/>
                <div className={styles.overlay}>
                  <h3>{e.title}</h3>
                  <p>{e.date}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
