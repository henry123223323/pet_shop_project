import React from 'react';
import ProductCard from '../ProductCard/ProductCard';
import styles from './ProductList.module.css';

export default function ProductList({
<<<<<<< HEAD
  products       = [],
  favoriteIds    = [],
  onToggleFavorite,
  onAddToCart,
  viewMode       = 'grid',           // 先接收 viewMode
}) {
  // 根據 viewMode 動態套用 .grid 或 .list
  const containerCls = `${styles.container} ${
    viewMode === 'grid' ? styles.grid : styles.list
  }`;

  return (
    <ul className={containerCls}>
      {products.map(p => (
        <li key={p.id} className={styles.item}>
          <ProductCard
            {...p}
            isFavorite={favoriteIds.includes(p.id)}
            onToggleFavorite={() => onToggleFavorite(p.id)}
            onAddToCart={() => onAddToCart(p.id)}
            viewMode={viewMode}       // 再把 viewMode 傳給卡片
=======
  products = [],
  favoriteIds = [],
  onToggleFavorite,
  onAddToCart,
}) {
  return (
    <ul className={styles.list}>
      {products.map(p => (
        <li key={p.id}>
          <ProductCard
            id={p.id}
            name={p.name}
            price={p.price}
            imageUrl={p.imageUrl}
            isFavorite={favoriteIds.includes(p.id)}
            onToggleFavorite={onToggleFavorite}
            onAddToCart={onAddToCart}
>>>>>>> test
          />
        </li>
      ))}
    </ul>
  );
}
