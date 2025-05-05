// NewsEventsSection.jsx
import React from 'react';
import styles from './NewsEventsSection.module.css';
import pawicon from './images/pawicon.svg'

// 範例資料
const events = [
  { id: 1, title: '我是測試快訊', date: '', img: '/images/event1.jpg', link: '#' },
  { id: 2, title: '我是測試快訊', date: '5/1 - 5/20', img: '/images/event2.jpg', link: '#' },
  { id: 3, title: '我是測試快訊', date: '2025/6/11', img: '/images/event3.jpg', link: '#' },
  { id: 4, title: '我是測試快訊', date: '4/12 - 6/28', img: '/images/event4.jpg', link: '#' },
  { id: 5, title: '我是測試快訊', date: '5/15', img: '/images/event5.jpg', link: '#' },
  { id: 6, title: '我是測試快訊', date: '6/01', img: '/images/event6.jpg', link: '#' }
];

function NewsEventsSection() {
  return (
    <div className='container-lg'>
    <section id="newsEvents">      
      <div className={styles.headerWrapper}>
        <h2 className={styles.title}>活動快報
          <img src={pawicon} className={styles.icon} /></h2>
      </div>
      <div className="row">
        {events.map(event => (
          <div key={event.id} className="col-6 col-md-6 col-lg-4 mb-4">
            <div className={styles.card}>
              <a href={event.link} className={styles.cardLink}>
                <div className={styles.imageWrapper}>
                  <img src={event.img} alt={event.title} className={styles.image} />                
                </div>
                <div className={styles.cardBody}>
                  <h3 className={styles.cardTitle}>{event.title}</h3>
                  {event.date && <p className={styles.cardDate}>{event.date}</p>}
                </div>
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
    </div>
  );
}

export default NewsEventsSection;