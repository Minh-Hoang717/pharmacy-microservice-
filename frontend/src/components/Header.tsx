import React from 'react';
import { ShoppingCart, Pill, LogIn, UserPlus, LogOut, ClipboardList } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../context/AuthContext';

export const Header: React.FC = () => {
  const { totalItems } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <Pill className="h-8 w-8 text-emerald-600 transition-transform group-hover:scale-110" />
            <span className="font-bold text-xl text-gray-900 tracking-tight">
              Pharmacy
            </span>
          </Link>

          <nav className="flex items-center gap-1">
            {/* Giỏ hàng — luôn hiển thị */}
            <Link
              to="/cart"
              className="relative p-2 rounded-md hover:bg-gray-100 transition-colors"
              aria-label="Giỏ hàng"
            >
              <ShoppingCart className="h-5 w-5 text-gray-700" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-emerald-600 rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <>
                {/* Đơn hàng */}
                <Link
                  to="/my-orders"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <ClipboardList className="h-4 w-4" />
                  <span className="hidden sm:inline">Đơn hàng</span>
                </Link>

                {/* Tên user */}
                <span className="hidden md:inline px-2 text-sm text-gray-500 border-l border-gray-200 ml-1 pl-3">
                  {user?.name}
                </span>

                {/* Đăng xuất */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  aria-label="Đăng xuất"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Đăng xuất</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Đăng nhập</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Đăng ký</span>
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};
