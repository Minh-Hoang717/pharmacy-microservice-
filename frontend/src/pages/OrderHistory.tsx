import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../services/api';
import type { OrderSummaryResponse } from '../types';
import { Loader2, AlertCircle, ChevronRight, ClipboardList } from 'lucide-react';

const VND = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });

// ─── Status Badge ──────────────────────────────────────────────────────────────

const STATUS_STYLE: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
};

const STATUS_LABEL: Record<string, string> = {
  pending: 'Chờ xử lý',
  completed: 'Hoàn thành',
  cancelled: 'Đã huỷ',
};

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const style = STATUS_STYLE[status] ?? 'bg-gray-50 text-gray-700 border-gray-200';
  const label = STATUS_LABEL[status] ?? status;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded border ${style}`}>
      {label}
    </span>
  );
};

// ─── Payment Status Badge ──────────────────────────────────────────────────────

const PAYMENT_STYLE: Record<string, string> = {
  unpaid: 'text-red-600',
  paid: 'text-emerald-600',
};

const PAYMENT_LABEL: Record<string, string> = {
  unpaid: 'Chưa thanh toán',
  paid: 'Đã thanh toán',
};

// ─── OrderHistory Page ─────────────────────────────────────────────────────────

export const OrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<OrderSummaryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await orderService.getMyOrders();
        setOrders(data);
      } catch {
        setError('Không thể tải lịch sử đơn hàng. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh] gap-3 text-emerald-600">
        <Loader2 className="h-7 w-7 animate-spin" />
        <span className="text-sm text-gray-500">Đang tải đơn hàng...</span>
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
    <div className="max-w-3xl mx-auto">
      <h1 className="text-xl font-semibold text-gray-900 mb-6">Lịch sử đơn hàng</h1>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border border-gray-200 rounded-lg bg-white">
          <ClipboardList className="h-10 w-10 text-gray-300 mb-4" />
          <p className="text-gray-600 font-medium">Chưa có đơn hàng nào</p>
          <p className="text-gray-500 text-sm mt-1">Hãy mua sắm để tạo đơn hàng đầu tiên!</p>
          <Link
            to="/"
            className="mt-5 px-5 py-2 text-sm bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition"
          >
            Mua sắm ngay
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <Link
              key={order.id}
              to={`/my-orders/${order.id}`}
              className="block border border-gray-200 rounded-lg bg-white p-5 hover:border-gray-300 transition-colors group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-gray-900">Đơn #{order.id}</span>
                    <StatusBadge status={order.status} />
                  </div>

                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                    <span>
                      {new Date(order.createdAt).toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    <span>{order.itemCount} loại sản phẩm</span>
                    <span
                      className={PAYMENT_STYLE[order.paymentStatus] ?? 'text-gray-500'}
                    >
                      {PAYMENT_LABEL[order.paymentStatus] ?? order.paymentStatus}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-base font-semibold text-gray-900">
                    {VND.format(order.totalAmount)}
                  </span>
                  <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
