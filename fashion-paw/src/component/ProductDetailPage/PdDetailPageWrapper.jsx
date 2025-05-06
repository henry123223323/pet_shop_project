// PdDetailPageWrapper.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import PdDetailPage from './ProductDetailPage';

export default function PdDetailPageWrapper() {
  const { pid } = useParams();
  return <PdDetailPage pid={pid} />;
}