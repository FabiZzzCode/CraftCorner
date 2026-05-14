import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { Cart, CartItemRequest } from '../models/cart.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private http = inject(HttpClient);
  private readonly API = '/api/cart';

  cartCount = signal<number>(0);

  getCart(): Observable<ApiResponse<Cart>> {
    return this.http.get<ApiResponse<Cart>>(this.API).pipe(
      tap(res => { if (res.success) this.cartCount.set(res.data?.itemCount ?? 0); })
    );
  }

  addItem(req: CartItemRequest): Observable<ApiResponse<Cart>> {
    return this.http.post<ApiResponse<Cart>>(`${this.API}/add`, req).pipe(
      tap(res => { if (res.success) this.cartCount.set(res.data?.itemCount ?? 0); })
    );
  }

  updateItem(cartItemId: number, quantity: number): Observable<ApiResponse<Cart>> {
    const params = new HttpParams().set('quantity', quantity);
    return this.http.put<ApiResponse<Cart>>(`${this.API}/update/${cartItemId}`, {}, { params }).pipe(
      tap(res => { if (res.success) this.cartCount.set(res.data?.itemCount ?? 0); })
    );
  }

  removeItem(cartItemId: number): Observable<ApiResponse<Cart>> {
    return this.http.delete<ApiResponse<Cart>>(`${this.API}/remove/${cartItemId}`).pipe(
      tap(res => { if (res.success) this.cartCount.set(res.data?.itemCount ?? 0); })
    );
  }

  clearCart(): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.API}/clear`).pipe(
      tap(() => this.cartCount.set(0))
    );
  }
}
