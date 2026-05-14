import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product.model';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;
  @Output() addedToCart = new EventEmitter<void>();

  auth = inject(AuthService);
  cartService = inject(CartService);
  wishlistService = inject(WishlistService);

  addToCart(e: Event): void {
    e.preventDefault();
    if (!this.auth.isLoggedIn()) return;
    this.cartService.addItem({ productId: this.product.id, quantity: 1 }).subscribe(() => {
      this.addedToCart.emit();
    });
  }

  stars(rating: number): number[] {
    return Array.from({ length: 5 }, (_, i) => i + 1);
  }

  get placeholderImg(): string {
    return 'assets/placeholder-product.jpg';
  }
}
