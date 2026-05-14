import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ShopService } from '../../services/shop.service';
import { ProductService } from '../../services/product.service';
import { ProductCardComponent } from '../../shared/product-card/product-card.component';
import { SpinnerComponent } from '../../shared/spinner/spinner.component';
import { Shop } from '../../models/shop.model';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-shop-detail',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, SpinnerComponent],
  template: `
    @if (loading) { <app-spinner /> }
    @if (!loading && shop) {
      <div class="shop-banner" [style.backgroundImage]="'url(' + (shop.bannerUrl || '') + ')'">
        <div class="container">
          <div class="shop-header">
            <div class="shop-logo-big">{{ shop.name.charAt(0) }}</div>
            <div>
              <h2>{{ shop.name }}</h2>
              <p>{{ shop.description }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="container py-4">
        <h3 class="section-title">Products</h3>
        <div class="row g-3">
          @for (p of products; track p.id) {
            <div class="col-6 col-md-3"><app-product-card [product]="p"/></div>
          }
        </div>
      </div>
    }
  `,
  styles: [`.shop-banner{background:var(--cc-dark-brown);padding:3rem 0;}
    .shop-header{display:flex;gap:1.5rem;align-items:center;color:#fff;}
    .shop-logo-big{width:80px;height:80px;border-radius:50%;background:var(--cc-tan);
      color:var(--cc-dark-brown);font-size:2rem;font-family:'Playfair Display',serif;
      display:flex;align-items:center;justify-content:center;flex-shrink:0;}
    h2{font-size:1.8rem;color:var(--cc-beige);} p{color:rgba(255,255,255,0.7);font-size:0.9rem;}`]
})
export class ShopDetailComponent implements OnInit {
  route = inject(ActivatedRoute);
  shopService = inject(ShopService);
  productService = inject(ProductService);
  shop: Shop | null = null;
  products: Product[] = [];
  loading = true;
  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.shopService.getById(id).subscribe(res => {
      this.shop = res.data;
      this.loading = false;
    });
    this.productService.getByShop(id).subscribe(res => this.products = res.data.content);
  }
}
