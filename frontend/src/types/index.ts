// ─── Pagination ────────────────────────────────────────────────────────────────

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

// ─── Product ───────────────────────────────────────────────────────────────────

/** DTO nhẹ dùng cho danh sách sản phẩm (không có productDescription) */
export interface ProductSummary {
  id: number;
  productName: string;
  buyingPrice: number;
  shortDescription?: string;
  active: boolean;
}

/** DTO đầy đủ dùng cho trang chi tiết */
export interface Product extends ProductSummary {
  productDescription?: string;
}

/** Item trong giỏ hàng */
export interface CartItem extends Product {
  quantity: number;
}

// ─── Category / Brand ──────────────────────────────────────────────────────────

export interface Category {
  id: number;
  categoryName: string;
  active: boolean;
}

export interface Brand {
  id: number;
  brandName: string;
  active: boolean;
}

// ─── Auth ──────────────────────────────────────────────────────────────────────

export interface AuthUser {
  token: string;
  email: string;
  name: string;
  userId: number;
  role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
}

// ─── Order ─────────────────────────────────────────────────────────────────────

export interface OrderPayload {
  paymentMethod: string;
  orderItems: {
    productId: number;
    quantity: number;
    price: number;
  }[];
}

export interface OrderItemResponse {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  subtotal: number;
}

/** DTO nhẹ dùng cho danh sách lịch sử đơn hàng */
export interface OrderSummaryResponse {
  id: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
  totalAmount: number;
  itemCount: number;
}

/** DTO đầy đủ dùng cho trang chi tiết đơn hàng */
export interface OrderResponse {
  id: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
  totalAmount: number;
  items: OrderItemResponse[];
}
