import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../../shared/product-card/product-card.component';
import { SpinnerComponent } from '../../shared/spinner/spinner.component';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { Product } from '../../models/product.model';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule, ProductCardComponent, SpinnerComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);

  featuredProducts: Product[] = [];
  categories: Category[] = [];
  loading = true;

  ngOnInit(): void {
    this.productService.getAll({ size: 8 }).subscribe(res => {
      this.featuredProducts = res.data.content;
      this.loading = false;
    });
    this.categoryService.getAll().subscribe(res => {
      this.categories = res.data.slice(0, 6);
    });
  }
}
