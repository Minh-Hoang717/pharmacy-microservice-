import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { orderService } from '../services/api';
import { Trash2, Plus, Minus, CreditCard, Loader2, Info, Pill } from 'lucide-react';

export const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, clearCart, totalPrice } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Custom Dynamic Input cho user
  const [customerId, setCustomerId] = useState<string>('8');

  const formattedTotal = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    
    const parsedUserId = parseInt(customerId, 10);
    if (isNaN(parsedUserId)) {
      setError('Mã khách hàng phải là số');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const payload = {
        userId: parsedUserId, 
        paymentMethod: 'cash',
        orderItems: cart.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.buyingPrice
        }))
      };

      const res = await orderService.createOrder(payload);
      
      if (res.status === 201 || res.status === 200) {
        alert('Đặt hàng thành công!');
        clearCart();
        navigate('/');
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || 'Có lỗi xảy ra khi tạo đơn hàng.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="bg-gray-100 p-6 rounded-full mb-4">
          <ShoppingCartIcon className="h-12 w-12 text-gray-400" />
        </div>
        <h2 className="text-xl font-medium text-gray-900 mb-2">Giỏ hàng của bạn đang trống</h2>
        <p className="text-gray-500 mb-6">Hãy thêm một vài sản phẩm để tiến hành thanh toán.</p>
        <button 
          onClick={() => navigate('/')} 
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-md font-medium transition"
        >
          Tiếp tục mua sắm
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Giỏ hàng của bạn</h1>
      
      {error && (
        <div className="mb-6 p-4 rounded-md bg-red-50 border border-red-200 text-red-700 flex items-start gap-3">
          <Info className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Cột Danh sách sản phẩm (Bên trái) */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map(item => (
            <div key={item.id} className="flex gap-4 bg-white p-4 rounded-lg border border-gray-200 items-center">
              <div className="h-20 w-20 flex-shrink-0 bg-gray-50 rounded-md overflow-hidden flex items-center justify-center border border-gray-100">
                <Pill className="text-emerald-200 w-8 h-8" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-sm md:text-base font-medium text-gray-900 truncate" title={item.productName}>
                  {item.productName}
                </h3>
                <p className="text-sm text-emerald-600 font-bold mt-1">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.buyingPrice || 0)}
                </p>
              </div>

              <div className="flex items-center gap-3">
                 <div className="flex items-center border border-gray-300 rounded-md">
                   <button 
                     type="button"
                     className="p-1 px-2 hover:bg-gray-100 text-gray-600 rounded-l-md transition"
                     onClick={() => updateQuantity(item.id, item.quantity - 1)}
                   >
                     <Minus className="h-4 w-4" />
                   </button>
                   <span className="text-sm font-medium w-8 text-center bg-gray-50 py-1">{item.quantity}</span>
                   <button 
                     type="button"
                     className="p-1 px-2 hover:bg-gray-100 text-gray-600 rounded-r-md transition"
                     onClick={() => updateQuantity(item.id, item.quantity + 1)}
                   >
                     <Plus className="h-4 w-4" />
                   </button>
                 </div>
                 
                 <button 
                   type="button"
                   onClick={() => removeFromCart(item.id)}
                   className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition"
                   title="Xoá sản phẩm"
                 >
                   <Trash2 className="h-5 w-5" />
                 </button>
              </div>
            </div>
          ))}
        </div>

        {/* Cột Thanh toán (Bên phải) */}
        <div className="lg:col-span-4">
          <form onSubmit={handleCheckout} className="bg-gray-50 border border-gray-200 rounded-lg p-6 sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-4 mb-4">
              Tóm tắt đơn hàng
            </h2>
            
            <div className="mb-4">
               <label htmlFor="customerId" className="block text-sm font-medium text-gray-700 mb-1">
                 Mã Khách Hàng (Tạm thời)
               </label>
               <input 
                 id="customerId"
                 type="number" 
                 required
                 value={customerId}
                 onChange={(e) => setCustomerId(e.target.value)}
                 className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
               />
               <p className="text-xs text-gray-500 mt-1">Do chưa có đăng nhập, vui lòng nhập ID tĩnh vào đây.</p>
            </div>

            <div className="space-y-3 mb-6 pt-4 border-t border-gray-200">
              <div className="flex justify-between text-gray-600 text-sm">
                <span>Tạm tính ({cart.length} món)</span>
                <span>{formattedTotal}</span>
              </div>
              <div className="flex justify-between text-gray-600 text-sm">
                <span>Phí giao hàng</span>
                <span className="text-emerald-600">Miễn phí</span>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4 mb-6">
              <div className="flex justify-between items-end">
                <span className="text-base font-medium text-gray-900">Tổng cộng</span>
                <span className="text-xl font-bold text-emerald-600">{formattedTotal}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || cart.length === 0}
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white rounded-md py-3 px-4 font-semibold hover:bg-emerald-700 transition disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <CreditCard className="h-5 w-5" />
                  Đặt hàng ngay
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// Cần custom icon cho trống giỏ
const ShoppingCartIcon = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="21" r="1"/>
    <circle cx="19" cy="21" r="1"/>
    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
  </svg>
);
