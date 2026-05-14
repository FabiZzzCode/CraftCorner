import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ShopService } from '../../services/shop.service';
import { Shop } from '../../models/shop.model';
import { SpinnerComponent } from '../../shared/spinner/spinner.component';

@Component({
  selector: 'app-shops',
  standalone: true,
  imports: [RouterLink, CommonModule, SpinnerComponent],
  template: `
    <div class="page-wrapper">
      <div class="container">
        <h2 class="section-title">All Shops</h2>
        @if (loading) { <app-spinner /> }
        <div class="row g-3">
          @for (shop of shops; track shop.id) {
            <div class="col-md-4 col-lg-3">
              <a [routerLink]="['/shops', shop.id]" class="shop-card-link">
                <div class="card text-center p-3">
                  <div class="shop-logo">{{ shop.name.charAt(0) }}</div>
                  <h6 class="mt-2">{{ shop.name }}</h6>
                  <p class="small text-muted">by {{ shop.sellerName }}</p>
                </div>
              </a>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`.shop-logo { width:60px;height:60px;border-radius:50%;background:var(--cc-brown);color:#fff;
    font-size:1.5rem;font-family:'Playfair Display',serif;display:flex;align-items:center;
    justify-content:center;margin:0 auto; } .shop-card-link{text-decoration:none;}`]
})
export class ShopsComponent implements OnInit {
  shopService = inject(ShopService);
  shops: Shop[] = [];
  loading = true;
  ngOnInit() {
    this.shopService.getAll(0, 50).subscribe(res => {
      this.shops = res.data.content.filter(s => s.status === 'APPROVED');
      this.loading = false;
    });
  }
}
