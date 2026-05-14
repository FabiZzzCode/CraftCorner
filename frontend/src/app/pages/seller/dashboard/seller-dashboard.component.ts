import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../services/product.service';
import { OrderService } from '../../../services/order.service';
import { ShopService } from '../../../services/shop.service';
import { SpinnerComponent } from '../../../shared/spinner/spinner.component';
import { Shop } from '../../../models/shop.model';
import { Order } from '../../../models/order.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-seller-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule, SpinnerComponent],
  templateUrl: './seller-dashboard.component.html',
  styleUrl: './seller-dashboard.component.scss'
})
export class SellerDashboardComponent implements OnInit {
  private productService = inject(ProductService);
  private orderService = inject(OrderService);
  private shopService = inject(ShopService);

  shop: Shop | null = null;
  recentOrders: Order[] = [];
  stats = { totalProducts: 0, totalOrders: 0, pendingOrders: 0 };
  loading = true;

  ngOnInit(): void {
    this.shopService.getMyShop().subscribe({
      next: res => {
        this.shop = res.data;
        this.loadDashboardData();
      },
      error: () => { this.loading = false; }
    });
  }

  private loadDashboardData(): void {
    forkJoin({
      products: this.productService.getMyProducts(0, 1),
      orders: this.orderService.getSellerOrders(0, 5)
    }).subscribe({
      next: ({ products, orders }) => {
        this.stats.totalProducts = products.data.totalElements;
        this.stats.totalOrders = orders.data.totalElements;
        this.recentOrders = orders.data.content;
        this.stats.pendingOrders = this.recentOrders.filter(o => o.orderStatus === 'PENDING').length;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }
}
