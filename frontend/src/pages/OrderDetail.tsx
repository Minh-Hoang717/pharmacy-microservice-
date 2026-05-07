import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderService } from '../services/api';
import type { OrderResponse } from '../types';
import { Loader2, AlertCircle, ArrowLeft } from 'lucide-react';

const VND = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });

// ─── Status / Payment helpers ─────────────────────────

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

const PAYMENT_LABEL: Record<string, string> = {
  unpaid: 'Chưa thanh toán',
  paid: 'Đã thanh toán',
  cash: 'Tiền mặt',
};

// ─── OrderDetail Page ──────────────────────────────────────────────────────────

export const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await orderService.getOrderById(Number(id));
        setOrder(data);
      } catch {
        setError('Không thể tải chi tiết đơn hàng. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh] gap-3 text-emerald-600">
        <Loader2 className="h-7 w-7 animate-spin" />
        <span className="text-sm text-gray-500">Đang tải chi tiết đơn hàng...</span>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-500 hover:text-gray-900 mb-6 text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Quay lại
        </button>
        <div className="flex items-center gap-2 p-4 text-red-700 bg-red-50 border border-red-200 rounded-md">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p>{error ?? 'Đơn hàng không tồn tại.'}</p>
        </div>
      </div>
    );
  }

  const statusStyle = STATUS_STYLE[order.status] ?? 'bg-gray-50 text-gray-700 border-gray-200';
  const statusLabel = STATUS_LABEL[order.status] ?? order.status;

  return (
    <div className="max-w-3xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-500 hover:text-gray-900 mb-6 text-sm transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1.5" />
        Quay lại lịch sử đơn hàng
      </button>

      {/* Header info */}
      <div className="border border-gray-200 rounded-lg bg-white p-5 mb-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-lg font-semibold text-gray-900">Đơn hàng #{order.id}</h1>
              <span
                className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded border ${statusStyle}`}
              >
                {statusLabel}
              </span>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
              <span>
                Ngày đặt:{' '}
                {new Date(order.createdAt).toLocaleDateString('vi-VN', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
              <span>
                Phương thức: {PAYMENT_LABEL[order.paymentMethod] ?? order.paymentMethod}
              </span>
              <span>
                Thanh toán:{' '}
                {PAYMENT_LABEL[order.paymentStatus] ?? order.paymentStatus}
              </span>
            </div>
          </div>

          <div className="text-right">
            <p className="text-xs text-gray-500 mb-0.5">Tổng cộng</p>
            <p className="text-xl font-bold text-emerald-600">{VND.format(order.totalAmount)}</p>
          </div>
        </div>
      </div>

      {/* Items table */}
      <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-5 py-3 font-medium text-gray-600">Sản phẩm</th>
              <th className="text-right px-5 py-3 font-medium text-gray-600">Đơn giá</th>
              <th className="text-right px-5 py-3 font-medium text-gray-600">SL</th>
              <th className="text-right px-5 py-3 font-medium text-gray-600">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.productId} className="border-b border-gray-100 last:border-0">
                <td className="px-5 py-3 text-gray-800">{item.productName}</td>
                <td className="px-5 py-3 text-gray-600 text-right">{VND.format(item.price)}</td>
                <td className="px-5 py-3 text-gray-600 text-right">{item.quantity}</td>
                <td className="px-5 py-3 font-medium text-gray-900 text-right">
                  {VND.format(item.subtotal)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-50 border-t border-gray-200">
              <td colSpan={3} className="px-5 py-3 text-right font-medium text-gray-700">
                Tổng cộng
              </td>
              <td className="px-5 py-3 text-right font-bold text-emerald-600">
                {VND.format(order.totalAmount)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
