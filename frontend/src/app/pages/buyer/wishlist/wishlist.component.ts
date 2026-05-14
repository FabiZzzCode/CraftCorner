import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { WishlistService } from '../../../services/wishlist.service';
import { ProductCardComponent } from '../../../shared/product-card/product-card.component';
import { SpinnerComponent } from '../../../shared/spinner/spinner.component';
import { Product } from '../../../models/product.model';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [RouterLink, CommonModule, ProductCardComponent, SpinnerComponent],
  template: `
    <div class="page-wrapper">
      <div class="container">
        <h2 class="section-title">My Wishlist</h2>
        @if (loading) { <app-spinner /> }
        @if (!loading) {
          @if (products.length === 0) {
            <div class="text-center py-5">
              <i class="fa-regular fa-heart fa-3x text-muted mb-3"></i>
              <h5>Your wishlist is empty</h5>
              <a routerLink="/products" class="btn btn-primary mt-2">Browse Products</a>
            </div>
          } @else {
            <div class="row g-3">
              @for (p of products; track p.id) {
                <div class="col-6 col-md-4 col-lg-3">
                  <div class="position-relative">
                    <app-product-card [product]="p" />
                    <button class="btn btn-sm btn-danger position-absolute top-0 end-0 m-2"
                            (click)="remove(p.id)" style="border-radius:50%;width:30px;height:30px;padding:0">
                      <i class="fa-solid fa-times"></i>
                    </button>
                  </div>
                </div>
              }
            </div>
          }
        }
      </div>
    </div>
  `
})
export class WishlistComponent implements OnInit {
  wishlistService = inject(WishlistService);
  products: Product[] = [];
  loading = true;
  ngOnInit() {
    this.wishlistService.getWishlist().subscribe(res => { this.products = res.data.content; this.loading = false; });
  }
  remove(productId: number) {
    this.wishlistService.remove(productId).subscribe(() => {
      this.products = this.products.filter(p => p.id !== productId);
    });
  }
}
