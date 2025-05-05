import React from 'react';
import ProductCard from '../ProductCard/ProductCard';
import styles from './ProductList.module.css';

export default function ProductList({
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
          />
        </li>
      ))}
    </ul>
  );
}
