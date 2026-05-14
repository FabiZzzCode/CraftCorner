import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, PageResponse } from '../models/api-response.model';
import { Product, ProductFilter, ProductRequest } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private readonly API = '/api/products';

  getAll(filter: ProductFilter = {}): Observable<ApiResponse<PageResponse<Product>>> {
    let params = new HttpParams()
      .set('page', filter.page ?? 0)
      .set('size', filter.size ?? 20)
      .set('sortBy', filter.sortBy ?? 'createdAt')
      .set('sortDir', filter.sortDir ?? 'desc');
    return this.http.get<ApiResponse<PageResponse<Product>>>(this.API, { params });
  }

  getById(id: number): Observable<ApiResponse<Product>> {
    return this.http.get<ApiResponse<Product>>(`${this.API}/${id}`);
  }

  search(keyword: string, page = 0, size = 20): Observable<ApiResponse<PageResponse<Product>>> {
    const params = new HttpParams().set('keyword', keyword).set('page', page).set('size', size);
    return this.http.get<ApiResponse<PageResponse<Product>>>(`${this.API}/search`, { params });
  }

  getByShop(shopId: number, page = 0, size = 20): Observable<ApiResponse<PageResponse<Product>>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<ApiResponse<PageResponse<Product>>>(`${this.API}/shop/${shopId}`, { params });
  }

  getByCategory(categoryId: number, page = 0, size = 20): Observable<ApiResponse<PageResponse<Product>>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<ApiResponse<PageResponse<Product>>>(`${this.API}/category/${categoryId}`, { params });
  }

  getMyProducts(page = 0, size = 20): Observable<ApiResponse<PageResponse<Product>>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<ApiResponse<PageResponse<Product>>>(`${this.API}/my-products`, { params });
  }

  create(req: ProductRequest): Observable<ApiResponse<Product>> {
    return this.http.post<ApiResponse<Product>>(this.API, req);
  }

  update(id: number, req: ProductRequest): Observable<ApiResponse<Product>> {
    return this.http.put<ApiResponse<Product>>(`${this.API}/${id}`, req);
  }

  delete(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.API}/${id}`);
  }

  toggleStatus(id: number): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${this.API}/${id}/toggle-status`, {});
  }
}
