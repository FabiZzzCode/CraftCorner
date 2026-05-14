import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../services/order.service';
import { SpinnerComponent } from '../../../shared/spinner/spinner.component';
import { Order } from '../../../models/order.model';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [RouterLink, CommonModule, SpinnerComponent],
  template: `
    @if (loading) { <app-spinner /> }
    @if (!loading && order) {
      <div class="page-wrapper">
        <div class="container" style="max-width:800px">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h2 class="section-title mb-0">Order #{{ order.orderNumber }}</h2>
            <span class="badge badge-{{order.orderStatus.toLowerCase()}} px-3 py-2">{{ order.orderStatus }}</span>
          </div>
          <p class="text-muted small mb-4">Placed on {{ order.createdAt | date:'longDate' }}</p>
          <div class="card p-3 mb-3">
            <h6>Items</h6>
            @for (item of order.items; track item.id) {
              <div class="d-flex align-items-center gap-3 py-2 border-bottom">
                <img [src]="item.productImage || 'assets/placeholder-product.jpg'" style="width:56px;height:56px;object-fit:cover;border-radius:8px;">
                <div class="flex-grow-1">
                  <p class="mb-0 fw-semibold">{{ item.productName }}</p>
                  <p class="small text-muted mb-0">{{ item.shopName }} · Qty: {{ item.quantity }}</p>
                </div>
                <span class="fw-bold">৳{{ item.totalPrice | number:'1.0-0' }}</span>
              </div>
            }
            <div class="d-flex justify-content-between pt-2"><span>Subtotal</span><span>৳{{ order.subtotal | number:'1.0-0' }}</span></div>
            <div class="d-flex justify-content-between"><span>Delivery</span><span>৳{{ order.deliveryCharge | number:'1.0-0' }}</span></div>
            <div class="d-flex justify-content-between fw-bold border-top pt-2 mt-1"><span>Total</span><span>৳{{ order.totalAmount | number:'1.0-0' }}</span></div>
          </div>
          @if (order.shippingAddress) {
            <div class="card p-3 mb-3">
              <h6>Shipping Address</h6>
              <p class="mb-0 small">{{ order.shippingAddress.fullName }}, {{ order.shippingAddress.phone }}</p>
              <p class="mb-0 small text-muted">{{ order.shippingAddress.addressLine1 }}, {{ order.shippingAddress.city }}, {{ order.shippingAddress.country }}</p>
            </div>
          }
          <a routerLink="/orders" class="btn btn-outline-primary btn-sm">← Back to Orders</a>
        </div>
      </div>
    }
  `
})
export class OrderDetailComponent implements OnInit {
  route = inject(ActivatedRoute);
  orderService = inject(OrderService);
  order: Order | null = null;
  loading = true;
  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.orderService.getById(id).subscribe(res => { this.order = res.data; this.loading = false; });
  }
}
