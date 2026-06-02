export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  category: number;
  category_name: string;
  description: string;
  price: string;
  stock: number;
  image: string | null;
  brand: string;
  specifications: Record<string, string | number | boolean>;
  is_active: boolean;
  created_at: string;
}

export interface CartItem {
  id: number;
  product_id: number;
  product_name: string;
  product_price: string;
  quantity: number;
  subtotal: string;
}

export interface Cart {
  id: number;
  session_id: string;
  items: CartItem[];
  total: string;
  created_at: string;
}

export interface Order {
  id: number;
  session_id: string;
  status: string;
  total_amount: string;
  customer_name: string;
  customer_email: string;
  shipping_address: string;
  phone: string;
  items: CartItem[];
  created_at: string;
}

export interface CheckoutPayload {
  session_id: string;
  customer_name: string;
  customer_email: string;
  shipping_address: string;
  phone?: string;
}

export interface ProductFilters {
  search?: string;
  ordering?: string;
  category?: string;
  brand?: string;
  min_price?: string;
  max_price?: string;
}
