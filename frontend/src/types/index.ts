export interface Product {
  id: number;
  productName: string;
  buyingPrice: number;
  productDescription?: string;
  shortDescription?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface OrderPayload {
  userId: number;
  paymentMethod: string;
  couponId?: number;
  orderItems: {
    productId: number;
    quantity: number;
    price: number;
  }[];
}
