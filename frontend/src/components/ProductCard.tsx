import React from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // Format VND currency
  const formattedPrice = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(product.price);

  return (
    <Link 
      to={`/product/${product.id}`}
      className="group flex flex-col bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-emerald-500 transition-colors"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-gray-100 flex-shrink-0">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
      </div>
      
      <div className="flex flex-col flex-1 p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2" title={product.name}>
          {product.name}
        </h3>
        <p className="text-lg font-bold text-emerald-600 mt-auto">
          {formattedPrice}
        </p>
      </div>
    </Link>
  );
};
