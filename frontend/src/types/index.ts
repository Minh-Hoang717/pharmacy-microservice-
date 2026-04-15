export interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  description?: string;
  stock?: number;
  // Các field khác tuỳ thuộc backend trả về
}

export interface CartItem extends Product {
  quantity: number;
}

export interface OrderPayload {
  userId: number;
  paymentMethod: string;
  orderItems: {
    productId: number;
    quantity: number;
    price: number;
  }[];
}
