import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Cart, Category, CheckoutPayload, Order, Product, ProductFilters } from './models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private readonly http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${environment.productApiUrl}/categories/`);
  }

  getProducts(filters: ProductFilters = {}): Observable<Product[]> {
    let params = new HttpParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params = params.set(key, value);
      }
    });
    return this.http.get<Product[]>(`${environment.productApiUrl}/`, { params });
  }

  getFeaturedProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${environment.productApiUrl}/featured/`);
  }

  getCart(sessionId: string): Observable<Cart> {
    return this.http.get<Cart>(`${environment.orderApiUrl}/cart/${sessionId}/`);
  }

  addToCart(sessionId: string, product: Product, quantity = 1): Observable<Cart> {
    return this.http.post<Cart>(`${environment.orderApiUrl}/cart/${sessionId}/add/`, {
      product_id: product.id,
      product_name: product.name,
      product_price: product.price,
      quantity
    });
  }

  removeCartItem(sessionId: string, itemId: number): Observable<Cart> {
    return this.http.delete<Cart>(`${environment.orderApiUrl}/cart/${sessionId}/remove/${itemId}/`);
  }

  clearCart(sessionId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${environment.orderApiUrl}/cart/${sessionId}/clear/`);
  }

  checkout(payload: CheckoutPayload): Observable<Order> {
    return this.http.post<Order>(`${environment.orderApiUrl}/checkout/`, payload);
  }

  getOrders(sessionId: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${environment.orderApiUrl}/`, {
      params: new HttpParams().set('session_id', sessionId)
    });
  }
}
