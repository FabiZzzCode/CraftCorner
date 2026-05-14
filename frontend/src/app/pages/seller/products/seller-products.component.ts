import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../services/product.service';
import { SpinnerComponent } from '../../../shared/spinner/spinner.component';
import { Product } from '../../../models/product.model';

@Component({
  selector: 'app-seller-products',
  standalone: true,
  imports: [RouterLink, CommonModule, SpinnerComponent],
  templateUrl: './seller-products.component.html',
  styleUrl: './seller-products.component.scss'
})
export class SellerProductsComponent implements OnInit {
  private productService = inject(ProductService);

  products: Product[] = [];
  totalElements = 0;
  page = 0;
  pageSize = 10;
  loading = true;
  togglingId: number | null = null;
  deletingId: number | null = null;

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.productService.getMyProducts(this.page, this.pageSize).subscribe({
      next: res => {
        this.products = res.data.content;
        this.totalElements = res.data.totalElements;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  toggleStatus(id: number): void {
    this.togglingId = id;
    this.productService.toggleStatus(id).subscribe({
      next: () => {
        const p = this.products.find(x => x.id === id);
        if (p) p.status = p.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
        this.togglingId = null;
      },
      error: () => { this.togglingId = null; }
    });
  }

  delete(id: number): void {
    if (!confirm('Delete this product?')) return;
    this.deletingId = id;
    this.productService.delete(id).subscribe({
      next: () => {
        this.products = this.products.filter(p => p.id !== id);
        this.totalElements--;
        this.deletingId = null;
      },
      error: () => { this.deletingId = null; }
    });
  }

  get totalPages() { return Math.ceil(this.totalElements / this.pageSize); }
  changePage(p: number) { this.page = p; this.load(); }
}
