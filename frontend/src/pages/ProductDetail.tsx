import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService } from '../services/api';
import type { Product } from '../types';
import { useCart } from '../hooks/useCart';
import { Loader2, ShoppingCart, ArrowLeft, CheckCircle, Pill } from 'lucide-react';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await productService.getProductById(Number(id));
        setProduct(data);
      } catch (err) {
        console.error('Lỗi khi lấy thông tin sản phẩm', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl text-gray-600">Sản phẩm không tồn tại</h2>
        <button onClick={() => navigate('/')} className="mt-4 text-emerald-600 hover:underline">
          Quay lại trang chủ
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const formattedPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.buyingPrice || 0);

  return (
    <div className="max-w-5xl mx-auto">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-500 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1.5" />
        Quay lại
      </button>

      <div className="bg-white border md:border-gray-200 border-transparent rounded-xl overflow-hidden md:shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="aspect-square bg-gray-50 flex items-center justify-center p-8 border-b md:border-b-0 md:border-r border-gray-100">
            <Pill className="w-32 h-32 text-emerald-200" />
          </div>

          <div className="flex flex-col justify-center p-6 md:p-10 pl-4 md:pl-0">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 tracking-tight">
              {product.productName}
            </h1>
            
            {product.shortDescription && (
              <p className="text-gray-500 mb-4">{product.shortDescription}</p>
            )}

            <p className="text-3xl font-extrabold text-emerald-600 mb-6">
              {formattedPrice}
            </p>
            
            {product.productDescription && (
              <div 
                className="prose prose-sm text-gray-600 mb-8 p-4 bg-gray-50 rounded-lg"
                dangerouslySetInnerHTML={{ __html: product.productDescription }}
              />
            )}

            <button
              onClick={handleAddToCart}
              className={`w-full py-3.5 px-6 rounded-md font-semibold text-white flex justify-center items-center gap-2 transition-all duration-200 ${
                added 
                  ? 'bg-emerald-500 hover:bg-emerald-600' 
                  : 'bg-emerald-600 hover:bg-emerald-700 active:transform active:scale-[0.98]'
              }`}
            >
              {added ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Đã thêm vào giỏ
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5" />
                  Thêm vào giỏ hàng
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
