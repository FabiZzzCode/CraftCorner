import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../services/cart.service';
import { SpinnerComponent } from '../../../shared/spinner/spinner.component';
import { Cart } from '../../../models/cart.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink, CommonModule, SpinnerComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
  cartService = inject(CartService);
  cart: Cart | null = null;
  loading = true;

  ngOnInit(): void { this.loadCart(); }

  loadCart(): void {
    this.cartService.getCart().subscribe(res => {
      this.cart = res.data;
      this.loading = false;
    });
  }

  updateQty(itemId: number, qty: number): void {
    if (qty < 1) return;
    this.cartService.updateItem(itemId, qty).subscribe(res => this.cart = res.data);
  }

  remove(itemId: number): void {
    this.cartService.removeItem(itemId).subscribe(res => this.cart = res.data);
  }

  clear(): void {
    this.cartService.clearCart().subscribe(() => this.loadCart());
  }
}
