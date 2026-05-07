import axios from 'axios';
import type {
  Product,
  ProductSummary,
  PageResponse,
  OrderPayload,
  OrderSummaryResponse,
  OrderResponse,
  AuthUser,
  LoginRequest,
  RegisterRequest,
  Category,
  Brand,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const TOKEN_KEY = 'auth_token';

// ─── Axios Instance ────────────────────────────────────────────────────────────

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Tự động gắn Bearer token nếu có
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Auth Service ──────────────────────────────────────────────────────────────

export const authService = {
  login: async (payload: LoginRequest): Promise<AuthUser> => {
    const response = await api.post<AuthUser>('/api/auth/login', payload);
    return response.data;
  },

  register: async (payload: RegisterRequest): Promise<void> => {
    await api.post('/api/auth/register', payload);
  },

  getMe: async (): Promise<AuthUser> => {
    const response = await api.get<AuthUser>('/api/auth/me');
    return response.data;
  },
};

// ─── Product Service ───────────────────────────────────────────────────────────

export interface ProductFilterParams {
  page?: number;
  size?: number;
  keyword?: string;
  categoryId?: number | null;
  brandId?: number | null;
}

export const productService = {
  getProducts: async (params: ProductFilterParams = {}): Promise<PageResponse<ProductSummary>> => {
    const { page = 0, size = 12, keyword, categoryId, brandId } = params;
    const response = await api.get<PageResponse<ProductSummary>>('/api/products', {
      params: {
        page,
        size,
        ...(keyword ? { keyword } : {}),
        ...(categoryId != null ? { categoryId } : {}),
        ...(brandId != null ? { brandId } : {}),
      },
    });
    return response.data;
  },

  getProductById: async (id: number): Promise<Product> => {
    const response = await api.get<Product>(`/api/products/${id}`);
    return response.data;
  },
};

// ─── Category / Brand Service ──────────────────────────────────────────────────

export const categoryService = {
  getCategories: async (): Promise<Category[]> => {
    const response = await api.get<Category[]>('/api/categories');
    return response.data;
  },

  getBrands: async (): Promise<Brand[]> => {
    const response = await api.get<Brand[]>('/api/brands');
    return response.data;
  },
};

// ─── Order Service ─────────────────────────────────────────────────────────────

export const orderService = {
  createOrder: async (payload: OrderPayload) => {
    const response = await api.post('/api/orders', payload);
    return response;
  },

  getMyOrders: async (): Promise<OrderSummaryResponse[]> => {
    const response = await api.get<OrderSummaryResponse[]>('/api/orders/my');
    return response.data;
  },

  getOrderById: async (id: number): Promise<OrderResponse> => {
    const response = await api.get<OrderResponse>(`/api/orders/${id}`);
    return response.data;
  },
};
