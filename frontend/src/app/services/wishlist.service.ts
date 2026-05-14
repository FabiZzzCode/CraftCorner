import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, PageResponse } from '../models/api-response.model';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private http = inject(HttpClient);
  private readonly API = '/api/wishlist';

  add(productId: number): Observable<ApiResponse<void>> {
    const params = new HttpParams().set('productId', productId);
    return this.http.post<ApiResponse<void>>(`${this.API}/add`, {}, { params });
  }

  getWishlist(page = 0, size = 20): Observable<ApiResponse<PageResponse<Product>>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<ApiResponse<PageResponse<Product>>>(this.API, { params });
  }

  remove(productId: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.API}/remove/${productId}`);
  }

  check(productId: number): Observable<ApiResponse<boolean>> {
    return this.http.get<ApiResponse<boolean>>(`${this.API}/check/${productId}`);
  }
}
