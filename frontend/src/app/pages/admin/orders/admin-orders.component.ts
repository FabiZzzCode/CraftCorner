import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../services/order.service';
import { SpinnerComponent } from '../../../shared/spinner/spinner.component';
import { Order, OrderStatus } from '../../../models/order.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiResponse, PageResponse } from '../../../models/api-response.model';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, SpinnerComponent],
  templateUrl: './admin-orders.component.html',
  styleUrl: './admin-orders.component.scss'
})
export class AdminOrdersComponent implements OnInit {
  private http = inject(HttpClient);

  orders: Order[] = [];
  totalElements = 0;
  page = 0;
  pageSize = 15;
  loading = true;
  filterStatus: OrderStatus | '' = '';

  readonly statuses: OrderStatus[] = ['PENDING','CONFIRMED','PROCESSING','SHIPPED','DELIVERED','CANCELLED'];

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    let params = new HttpParams().set('page', this.page).set('size', this.pageSize);
    if (this.filterStatus) params = params.set('status', this.filterStatus);
    this.http.get<ApiResponse<PageResponse<Order>>>('/api/orders/all', { params }).subscribe({
      next: res => {
        this.orders = res.data.content;
        this.totalElements = res.data.totalElements;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  onFilterChange(): void { this.page = 0; this.load(); }

  get totalPages() { return Math.ceil(this.totalElements / this.pageSize); }
  changePage(p: number) { this.page = p; this.load(); }
}
