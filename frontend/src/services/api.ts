import axios from 'axios';
import type { Product, OrderPayload } from '../types';

// Sử dụng biến môi trường lấy từ Vite
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const productService = {
  getProducts: async (): Promise<Product[]> => {
    const response = await api.get('/api/products');
    return response.data;
  },
  getProductById: async (id: number): Promise<Product> => {
    const response = await api.get(`/api/products/${id}`);
    return response.data;
  }
};

export const orderService = {
  createOrder: async (payload: OrderPayload) => {
    const response = await api.post('/api/orders', payload);
    return response;
  }
};
