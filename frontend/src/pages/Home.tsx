import React, { useEffect, useState } from 'react';
import { ProductCard } from '../components/ProductCard';
import { productService } from '../services/api';
import type { Product } from '../types';
import { Loader2, AlertCircle } from 'lucide-react';

export const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await productService.getProducts();
        setProducts(data);
      } catch (err) {
        setError('Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-emerald-600 gap-4">
        <Loader2 className="h-10 w-10 animate-spin" />
        <span className="text-gray-500 font-medium tracking-wide">Đang tải sản phẩm...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 p-4 text-red-700 bg-red-50 border border-red-200 rounded-md">
        <AlertCircle className="h-5 w-5 flex-shrink-0" />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Trang chủ / Sản phẩm</h1>
      
      {products.length === 0 ? (
        <div className="text-center py-12 text-gray-500 border border-gray-200 rounded-lg bg-white">
          Chưa có sản phẩm nào
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
