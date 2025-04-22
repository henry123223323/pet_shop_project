import React from 'react';
import ProductCard from '../ProductCard/ProductCard';
import styles from './ProductList.module.css';

export default function ProductList({
  products = [],
  favoriteIds = [],
  onToggleFavorite = () => {},
  onAddToCart = () => {},
}) {
  return (
    <div className={styles.grid}>
      {products.map(p => (
        <ProductCard
          key={p.id}
          id={p.id}
          name={p.name}
          price={p.price}
          imageUrl={p.imageUrl}
         isFavorite={favoriteIds.includes(p.id)}
         onToggleFavorite={onToggleFavorite}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
}