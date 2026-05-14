import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../services/order.service';
import { SpinnerComponent } from '../../../shared/spinner/spinner.component';
import { Order, OrderStatus } from '../../../models/order.model';

@Component({
  selector: 'app-seller-orders',
  standalone: true,
  imports: [CommonModule, SpinnerComponent],
  templateUrl: './seller-orders.component.html',
  styleUrl: './seller-orders.component.scss'
})
export class SellerOrdersComponent implements OnInit {
  private orderService = inject(OrderService);

  orders: Order[] = [];
  totalElements = 0;
  page = 0;
  pageSize = 10;
  loading = true;
  updatingId: number | null = null;

  readonly nextStatus: Partial<Record<OrderStatus, OrderStatus>> = {
    PENDING:    'CONFIRMED',
    CONFIRMED:  'PROCESSING',
    PROCESSING: 'SHIPPED',
    SHIPPED:    'DELIVERED'
  };

  readonly nextLabel: Partial<Record<OrderStatus, string>> = {
    PENDING:    'Confirm',
    CONFIRMED:  'Mark Processing',
    PROCESSING: 'Mark Shipped',
    SHIPPED:    'Mark Delivered'
  };

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.orderService.getSellerOrders(this.page, this.pageSize).subscribe({
      next: res => {
        this.orders = res.data.content;
        this.totalElements = res.data.totalElements;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  advance(order: Order): void {
    const next = this.nextStatus[order.orderStatus];
    if (!next) return;
    this.updatingId = order.id;
    this.orderService.updateStatus(order.id, next).subscribe({
      next: res => {
        const idx = this.orders.findIndex(o => o.id === order.id);
        if (idx !== -1) this.orders[idx] = res.data;
        this.updatingId = null;
      },
      error: () => { this.updatingId = null; }
    });
  }

  cancel(order: Order): void {
    if (!confirm('Cancel this order?')) return;
    this.updatingId = order.id;
    this.orderService.updateStatus(order.id, 'CANCELLED').subscribe({
      next: res => {
        const idx = this.orders.findIndex(o => o.id === order.id);
        if (idx !== -1) this.orders[idx] = res.data;
        this.updatingId = null;
      },
      error: () => { this.updatingId = null; }
    });
  }

  get totalPages() { return Math.ceil(this.totalElements / this.pageSize); }
  changePage(p: number) { this.page = p; this.load(); }
  canAdvance(status: OrderStatus) { return !!this.nextStatus[status]; }
  canCancel(status: OrderStatus) { return ['PENDING', 'CONFIRMED'].includes(status); }
}
