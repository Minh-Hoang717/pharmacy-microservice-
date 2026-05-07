import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/api';
import {
  Trash2, Plus, Minus, CreditCard, Loader2, Info, Pill, ShoppingCart, LogIn,
} from 'lucide-react';

const VND = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });

// ─── Auth Modal ────────────────────────────────────────────────────────────────

interface AuthModalProps {
  onClose: () => void;
  onGoLogin: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose, onGoLogin }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div className="bg-white rounded-lg border border-gray-200 p-6 w-full max-w-sm mx-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-amber-50 rounded-full">
          <LogIn className="h-5 w-5 text-amber-600" />
        </div>
        <h2 className="text-base font-semibold text-gray-900">Vui lòng đăng nhập</h2>
      </div>
      <p className="text-sm text-gray-600 mb-6">
        Bạn cần đăng nhập để tiến hành đặt hàng.
      </p>
      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
        >
          Huỷ
        </button>
        <button
          onClick={onGoLogin}
          className="flex-1 px-4 py-2 text-sm bg-emerald-600 text-white rounded-md font-medium hover:bg-emerald-700 transition"
        >
          Đến trang đăng nhập
        </button>
      </div>
    </div>
  </div>
);

// ─── Cart Page ─────────────────────────────────────────────────────────────────

export const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, clearCart, totalPrice } = useCart();
  const { isAuthenticated } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const formattedTotal = VND.format(totalPrice);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const payload = {
        paymentMethod: 'cash',
        orderItems: cart.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.buyingPrice,
        })),
      };

      const res = await orderService.createOrder(payload);

      if (res.status === 201 || res.status === 200) {
        setOrderSuccess(true);
        clearCart();
      }
    } catch (err: unknown) {
      const message =
        err &&
        typeof err === 'object' &&
        'response' in err &&
        (err as { response?: { data?: { message?: string } } }).response?.data?.message;
      setError(message || 'Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="p-4 bg-emerald-50 rounded-full mb-4">
          <CreditCard className="h-10 w-10 text-emerald-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Đặt hàng thành công!</h2>
        <p className="text-gray-500 text-sm mb-6">Đơn hàng của bạn đã được ghi nhận.</p>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/')}
            className="px-5 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
          >
            Tiếp tục mua sắm
          </button>
          <button
            onClick={() => navigate('/my-orders')}
            className="px-5 py-2 text-sm bg-emerald-600 text-white rounded-md font-medium hover:bg-emerald-700 transition"
          >
            Xem đơn hàng
          </button>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="bg-gray-100 p-6 rounded-full mb-4">
          <ShoppingCart className="h-12 w-12 text-gray-400" />
        </div>
        <h2 className="text-xl font-medium text-gray-900 mb-2">Giỏ hàng của bạn đang trống</h2>
        <p className="text-gray-500 mb-6">Hãy thêm một vài sản phẩm để tiến hành thanh toán.</p>
        <button
          onClick={() => navigate('/')}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-md font-medium transition text-sm"
        >
          Tiếp tục mua sắm
        </button>
      </div>
    );
  }

  return (
    <>
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onGoLogin={() => navigate('/login', { state: { from: { pathname: '/cart' } } })}
        />
      )}

      <div>
        <h1 className="text-xl font-semibold text-gray-900 mb-6">Giỏ hàng của bạn</h1>

        {error && (
          <div className="mb-6 p-3 rounded-md bg-red-50 border border-red-200 text-red-700 flex items-start gap-2 text-sm">
            <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Danh sách sản phẩm */}
          <div className="lg:col-span-8 space-y-3">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 bg-white p-4 rounded-lg border border-gray-200 items-center"
              >
                <div className="h-16 w-16 flex-shrink-0 bg-gray-50 rounded-md flex items-center justify-center border border-gray-100">
                  <Pill className="text-emerald-200 w-7 h-7" />
                </div>

                <div className="flex-1 min-w-0">
                  <h3
                    className="text-sm font-medium text-gray-900 truncate"
                    title={item.productName}
                  >
                    {item.productName}
                  </h3>
                  <p className="text-sm text-emerald-600 font-semibold mt-0.5">
                    {VND.format(item.buyingPrice || 0)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center border border-gray-300 rounded-md">
                    <button
                      type="button"
                      className="p-1 px-2 hover:bg-gray-100 text-gray-600 rounded-l-md transition"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="text-sm font-medium w-7 text-center bg-gray-50 py-1">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      className="p-1 px-2 hover:bg-gray-100 text-gray-600 rounded-r-md transition"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition"
                    title="Xoá sản phẩm"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Thanh toán */}
          <div className="lg:col-span-4">
            <form
              onSubmit={handleCheckout}
              className="bg-gray-50 border border-gray-200 rounded-lg p-5 sticky top-24"
            >
              <h2 className="text-base font-semibold text-gray-900 border-b border-gray-200 pb-3 mb-4">
                Tóm tắt đơn hàng
              </h2>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-gray-600 text-sm">
                  <span>Tạm tính ({cart.length} món)</span>
                  <span>{formattedTotal}</span>
                </div>
                <div className="flex justify-between text-gray-600 text-sm">
                  <span>Phí giao hàng</span>
                  <span className="text-emerald-600">Miễn phí</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-3 mb-5">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-900">Tổng cộng</span>
                  <span className="text-lg font-bold text-emerald-600">{formattedTotal}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || cart.length === 0}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white rounded-md py-2.5 px-4 font-medium text-sm hover:bg-emerald-700 transition disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4" />
                    Đặt hàng ngay
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
