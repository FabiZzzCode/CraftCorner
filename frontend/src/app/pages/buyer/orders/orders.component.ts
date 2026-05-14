import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../services/order.service';
import { SpinnerComponent } from '../../../shared/spinner/spinner.component';
import { Order } from '../../../models/order.model';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [RouterLink, CommonModule, SpinnerComponent],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit {
  orderService = inject(OrderService);
  orders: Order[] = [];
  loading = true;
  page = 0;
  totalPages = 0;

  ngOnInit(): void { this.load(); }

  load(): void {
    this.orderService.getMyOrders(this.page).subscribe(res => {
      this.orders = res.data.content;
      this.totalPages = res.data.totalPages;
      this.loading = false;
    });
  }

  statusClass(status: string): string {
    return 'badge-' + status.toLowerCase();
  }
}
