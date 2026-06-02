import { CurrencyPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { ApiService } from './api.service';
import { Cart, Category, Order, Product } from './models';
import { SessionService } from './session.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, NgFor, NgIf, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  readonly sessionId = this.session.getSessionId();
  categories: Category[] = [];
  products: Product[] = [];
  featuredProducts: Product[] = [];
  orders: Order[] = [];
  cart: Cart | null = null;
  loading = false;
  cartLoading = false;
  message = '';
  error = '';

  filtersForm = this.fb.nonNullable.group({
    search: [''],
    category: [''],
    brand: [''],
    min_price: [''],
    max_price: [''],
    ordering: ['-created_at']
  });

  checkoutForm = this.fb.nonNullable.group({
    customer_name: ['', Validators.required],
    customer_email: ['', [Validators.required, Validators.email]],
    shipping_address: ['', Validators.required],
    phone: ['']
  });

  constructor(
    private readonly api: ApiService,
    private readonly fb: FormBuilder,
    private readonly session: SessionService
  ) {}

  ngOnInit(): void {
    this.loadInitialData();
  }

  loadInitialData(): void {
    this.loading = true;
    this.error = '';

    this.api.getCategories().subscribe({
      next: (categories) => (this.categories = categories),
      error: () => this.showError('Could not load categories.')
    });

    this.api.getFeaturedProducts().subscribe({
      next: (products) => (this.featuredProducts = products),
      error: () => (this.featuredProducts = [])
    });

    this.loadProducts();
    this.loadCart();
    this.loadOrders();
  }

  loadProducts(): void {
    this.loading = true;
    this.api
      .getProducts(this.filtersForm.getRawValue())
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (products) => (this.products = products),
        error: () => this.showError('Could not load products. Check the product service URL.')
      });
  }

  resetFilters(): void {
    this.filtersForm.reset({
      search: '',
      category: '',
      brand: '',
      min_price: '',
      max_price: '',
      ordering: '-created_at'
    });
    this.loadProducts();
  }

  loadCart(): void {
    this.cartLoading = true;
    this.api
      .getCart(this.sessionId)
      .pipe(finalize(() => (this.cartLoading = false)))
      .subscribe({
        next: (cart) => (this.cart = cart),
        error: () => this.showError('Could not load cart. Check the order service URL.')
      });
  }

  addProduct(product: Product): void {
    this.cartLoading = true;
    this.api
      .addToCart(this.sessionId, product)
      .pipe(finalize(() => (this.cartLoading = false)))
      .subscribe({
        next: (cart) => {
          this.cart = cart;
          this.showMessage(`${product.name} added to cart.`);
        },
        error: () => this.showError('Could not add item to cart.')
      });
  }

  removeItem(itemId: number): void {
    this.api.removeCartItem(this.sessionId, itemId).subscribe({
      next: (cart) => (this.cart = cart),
      error: () => this.showError('Could not remove item.')
    });
  }

  clearCart(): void {
    this.api.clearCart(this.sessionId).subscribe({
      next: () => this.loadCart(),
      error: () => this.showError('Could not clear cart.')
    });
  }

  submitCheckout(): void {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    this.api
      .checkout({ session_id: this.sessionId, ...this.checkoutForm.getRawValue() })
      .subscribe({
        next: (order) => {
          this.showMessage(`Order #${order.id} created successfully.`);
          this.checkoutForm.reset();
          this.loadCart();
          this.loadOrders();
        },
        error: () => this.showError('Checkout failed. Make sure the cart has items.')
      });
  }

  loadOrders(): void {
    this.api.getOrders(this.sessionId).subscribe({
      next: (orders) => (this.orders = orders),
      error: () => (this.orders = [])
    });
  }

  imageUrl(product: Product): string {
    return product.image || '';
  }

  private showMessage(message: string): void {
    this.message = message;
    this.error = '';
    setTimeout(() => (this.message = ''), 2500);
  }

  private showError(message: string): void {
    this.error = message;
    this.message = '';
  }
}
