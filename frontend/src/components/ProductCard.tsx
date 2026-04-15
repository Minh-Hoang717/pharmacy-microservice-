import React from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../types';
import { Pill } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // Format VND currency
  const formattedPrice = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(product.buyingPrice || 0);

  return (
    <Link 
      to={`/product/${product.id}`}
      className="group flex flex-col bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-emerald-500 transition-colors"
    >
      <div className="relative aspect-square w-full bg-gray-50 flex items-center justify-center flex-shrink-0 group-hover:bg-gray-100 transition-colors">
        <Pill className="w-16 h-16 text-emerald-200 group-hover:text-emerald-300 transition-colors" />
      </div>
      
      <div className="flex flex-col flex-1 p-4 border-t border-gray-100">
        <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2" title={product.productName}>
          {product.productName}
        </h3>
        {product.shortDescription && (
          <p className="text-xs text-gray-500 line-clamp-1 mb-2">{product.shortDescription}</p>
        )}
        <p className="text-lg font-bold text-emerald-600 mt-auto">
          {formattedPrice}
        </p>
      </div>
    </Link>
  );
};
