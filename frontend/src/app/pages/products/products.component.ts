import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductCardComponent } from '../../shared/product-card/product-card.component';
import { SpinnerComponent } from '../../shared/spinner/spinner.component';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { Product } from '../../models/product.model';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ProductCardComponent, SpinnerComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private route = inject(ActivatedRoute);

  products: Product[] = [];
  categories: Category[] = [];
  loading = true;

  keyword = '';
  selectedCategory: number | null = null;
  sortBy = 'createdAt';
  sortDir: 'asc' | 'desc' = 'desc';

  page = 0;
  totalPages = 0;
  totalElements = 0;
  pageSize = 12;

  ngOnInit(): void {
    this.categoryService.getAll().subscribe(res => this.categories = res.data);
    this.route.queryParams.subscribe(params => {
      if (params['categoryId']) this.selectedCategory = +params['categoryId'];
      if (params['keyword']) this.keyword = params['keyword'];
      this.loadProducts();
    });
  }

  loadProducts(): void {
    this.loading = true;
    const obs = this.keyword
      ? this.productService.search(this.keyword, this.page, this.pageSize)
      : this.selectedCategory
        ? this.productService.getByCategory(this.selectedCategory, this.page, this.pageSize)
        : this.productService.getAll({ page: this.page, size: this.pageSize, sortBy: this.sortBy, sortDir: this.sortDir });

    obs.subscribe(res => {
      this.products = res.data.content;
      this.totalPages = res.data.totalPages;
      this.totalElements = res.data.totalElements;
      this.loading = false;
    });
  }

  search(): void { this.page = 0; this.selectedCategory = null; this.loadProducts(); }
  filterByCategory(id: number | null): void { this.selectedCategory = id; this.page = 0; this.keyword = ''; this.loadProducts(); }
  onSortChange(): void { this.page = 0; this.loadProducts(); }
  goToPage(p: number): void { this.page = p; this.loadProducts(); }
  get pages(): number[] { return Array.from({ length: this.totalPages }, (_, i) => i); }
}
