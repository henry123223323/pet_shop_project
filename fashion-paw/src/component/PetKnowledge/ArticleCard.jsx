import React from 'react';
import { Link } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import ArticleCardStyles from './ArticleCard.module.css';

export default function ArticleCard({ id, title, summary, imageUrl, date, topic, pet }) {
  return (
    <NavLink to={`/${topic}/${pet}/${id}`} className={ArticleCardStyles.card}>
      <img src={imageUrl} alt={title} className={ArticleCardStyles.thumb} />
      <div className={ArticleCardStyles.info}>
        <h3>{title}</h3>
        <p>{summary}</p>
        <small>{new Date(date).toLocaleDateString()}</small>
      </div>
    </NavLink>
  );
}
