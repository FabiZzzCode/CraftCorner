import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { ReviewService } from '../../services/review.service';
import { AuthService } from '../../services/auth.service';
import { Product } from '../../models/product.model';
import { Review } from '../../models/review.model';
import { SpinnerComponent } from '../../shared/spinner/spinner.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, SpinnerComponent],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private wishlistService = inject(WishlistService);
  private reviewService = inject(ReviewService);
  auth = inject(AuthService);

  product: Product | null = null;
  reviews: Review[] = [];
  loading = true;
  quantity = 1;
  selectedImage = '';
  inWishlist = false;
  addingToCart = false;
  cartSuccess = false;

  newRating = 5;
  newComment = '';
  newTitle = '';
  submittingReview = false;

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.productService.getById(id).subscribe(res => {
      this.product = res.data;
      this.selectedImage = res.data.primaryImageUrl || res.data.imageUrls?.[0] || '';
      this.loading = false;
    });
    this.reviewService.getProductReviews(id).subscribe(res => {
      this.reviews = res.data.content;
    });
    if (this.auth.isLoggedIn()) {
      this.wishlistService.check(id).subscribe(res => this.inWishlist = res.data);
    }
  }

  addToCart(): void {
    if (!this.product) return;
    this.addingToCart = true;
    this.cartService.addItem({ productId: this.product.id, quantity: this.quantity }).subscribe({
      next: () => { this.addingToCart = false; this.cartSuccess = true; setTimeout(() => this.cartSuccess = false, 3000); },
      error: () => { this.addingToCart = false; }
    });
  }

  toggleWishlist(): void {
    if (!this.product || !this.auth.isLoggedIn()) return;
    if (this.inWishlist) {
      this.wishlistService.remove(this.product.id).subscribe(() => this.inWishlist = false);
    } else {
      this.wishlistService.add(this.product.id).subscribe(() => this.inWishlist = true);
    }
  }

  submitReview(): void {
    if (!this.product) return;
    this.submittingReview = true;
    this.reviewService.addReview({ productId: this.product.id, rating: this.newRating, title: this.newTitle, comment: this.newComment }).subscribe({
      next: res => {
        this.reviews.unshift(res.data);
        this.newComment = ''; this.newTitle = ''; this.newRating = 5;
        this.submittingReview = false;
      },
      error: () => { this.submittingReview = false; }
    });
  }

  stars(n: number): number[] { return Array.from({ length: 5 }, (_, i) => i + 1); }
  setQty(n: number): void {
    if (!this.product) return;
    this.quantity = Math.max(1, Math.min(n, this.product.stockQuantity));
  }
}
