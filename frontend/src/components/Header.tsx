import React from 'react';
import { ShoppingCart, Pill } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';

export const Header: React.FC = () => {
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <Pill className="h-8 w-8 text-emerald-600 transition-transform group-hover:scale-110" />
            <span className="font-bold text-xl text-gray-900 tracking-tight">
              Pharma<span className="text-emerald-600">City</span> Clone
            </span>
          </Link>
          
          <nav className="flex items-center gap-4">
            <Link 
              to="/cart" 
              className="relative p-2 rounded-md hover:bg-gray-100 transition-colors"
              aria-label="Giỏ hàng"
            >
              <ShoppingCart className="h-6 w-6 text-gray-700" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-emerald-600 rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};
