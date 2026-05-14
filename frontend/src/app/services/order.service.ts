import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, PageResponse } from '../models/api-response.model';
import { Order, OrderRequest, OrderStatus } from '../models/order.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private http = inject(HttpClient);
  private readonly API = '/api/orders';

  placeOrder(req: OrderRequest): Observable<ApiResponse<Order>> {
    return this.http.post<ApiResponse<Order>>(`${this.API}/place`, req);
  }

  getMyOrders(page = 0, size = 10): Observable<ApiResponse<PageResponse<Order>>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<ApiResponse<PageResponse<Order>>>(`${this.API}/my-orders`, { params });
  }

  getSellerOrders(page = 0, size = 10): Observable<ApiResponse<PageResponse<Order>>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<ApiResponse<PageResponse<Order>>>(`${this.API}/seller-orders`, { params });
  }

  getById(id: number): Observable<ApiResponse<Order>> {
    return this.http.get<ApiResponse<Order>>(`${this.API}/${id}`);
  }

  updateStatus(id: number, status: OrderStatus): Observable<ApiResponse<Order>> {
    const params = new HttpParams().set('status', status);
    return this.http.put<ApiResponse<Order>>(`${this.API}/${id}/status`, {}, { params });
  }
}
