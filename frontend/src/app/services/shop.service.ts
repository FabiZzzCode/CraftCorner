import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, PageResponse } from '../models/api-response.model';
import { Shop, ShopRequest } from '../models/shop.model';

@Injectable({ providedIn: 'root' })
export class ShopService {
  private http = inject(HttpClient);
  private readonly API = '/api/shops';

  getAll(page = 0, size = 20): Observable<ApiResponse<PageResponse<Shop>>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<ApiResponse<PageResponse<Shop>>>(this.API, { params });
  }

  getById(id: number): Observable<ApiResponse<Shop>> {
    return this.http.get<ApiResponse<Shop>>(`${this.API}/${id}`);
  }

  getMyShop(): Observable<ApiResponse<Shop>> {
    return this.http.get<ApiResponse<Shop>>(`${this.API}/my-shop`);
  }

  create(req: ShopRequest): Observable<ApiResponse<Shop>> {
    return this.http.post<ApiResponse<Shop>>(this.API, req);
  }

  update(id: number, req: ShopRequest): Observable<ApiResponse<Shop>> {
    return this.http.put<ApiResponse<Shop>>(`${this.API}/${id}`, req);
  }

  approve(id: number): Observable<ApiResponse<Shop>> {
    return this.http.put<ApiResponse<Shop>>(`${this.API}/${id}/approve`, {});
  }

  reject(id: number): Observable<ApiResponse<Shop>> {
    return this.http.put<ApiResponse<Shop>>(`${this.API}/${id}/reject`, {});
  }

  delete(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.API}/${id}`);
  }
}
