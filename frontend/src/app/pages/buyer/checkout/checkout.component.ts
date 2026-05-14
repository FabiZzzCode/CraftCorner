import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../services/cart.service';
import { OrderService } from '../../../services/order.service';
import { Cart } from '../../../models/cart.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, RouterLink, CommonModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit {
  private fb = inject(FormBuilder);
  private cartService = inject(CartService);
  private orderService = inject(OrderService);
  private router = inject(Router);

  cart: Cart | null = null;
  loading = false;
  error = '';

  addressForm = this.fb.group({
    fullName:     ['', Validators.required],
    phone:        ['', Validators.required],
    addressLine1: ['', Validators.required],
    addressLine2: [''],
    city:         ['', Validators.required],
    state:        [''],
    postalCode:   [''],
    country:      ['Bangladesh']
  });

  paymentMethod: 'CASH_ON_DELIVERY' | 'ONLINE_PAYMENT' = 'CASH_ON_DELIVERY';

  ngOnInit(): void {
    this.cartService.getCart().subscribe(res => this.cart = res.data);
  }

  placeOrder(): void {
    if (this.addressForm.invalid) { this.addressForm.markAllAsTouched(); return; }
    this.loading = true;

    // In a full implementation, first save address then get addressId
    // For now, we use a placeholder addressId of 1 — this would need the address save API
    this.orderService.placeOrder({
      shippingAddressId: 1,
      paymentMethod: this.paymentMethod
    }).subscribe({
      next: res => {
        this.loading = false;
        this.router.navigate(['/orders', res.data.id]);
      },
      error: err => {
        this.loading = false;
        this.error = err.error?.message || 'Failed to place order. Please try again.';
      }
    });
  }

  get f() { return this.addressForm.controls; }
}
