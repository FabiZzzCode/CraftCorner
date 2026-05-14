import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../services/product.service';
import { SpinnerComponent } from '../../../shared/spinner/spinner.component';
import { Product } from '../../../models/product.model';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, SpinnerComponent],
  templateUrl: './admin-products.component.html',
  styleUrl: './admin-products.component.scss'
})
export class AdminProductsComponent implements OnInit {
  private productService = inject(ProductService);

  products: Product[] = [];
  totalElements = 0;
  page = 0;
  pageSize = 15;
  loading = true;
  deletingId: number | null = null;

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.productService.getAll({ page: this.page, size: this.pageSize }).subscribe({
      next: res => {
        this.products = res.data.content;
        this.totalElements = res.data.totalElements;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  delete(id: number): void {
    if (!confirm('Delete this product permanently?')) return;
    this.deletingId = id;
    this.productService.delete(id).subscribe({
      next: () => { this.products = this.products.filter(p => p.id !== id); this.totalElements--; this.deletingId = null; },
      error: () => { this.deletingId = null; }
    });
  }

  get totalPages() { return Math.ceil(this.totalElements / this.pageSize); }
  changePage(p: number) { this.page = p; this.load(); }
}
