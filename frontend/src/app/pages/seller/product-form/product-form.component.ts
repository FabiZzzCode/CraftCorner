import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';
import { SpinnerComponent } from '../../../shared/spinner/spinner.component';
import { Category } from '../../../models/category.model';
import { Product } from '../../../models/product.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink, SpinnerComponent],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class ProductFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);

  categories: Category[] = [];
  editProduct: Product | null = null;
  loading = true;
  saving = false;
  error = '';
  editId: number | null = null;

  form = this.fb.group({
    name:           ['', [Validators.required, Validators.minLength(3)]],
    description:    [''],
    price:          [null as number | null, [Validators.required, Validators.min(1)]],
    discountPrice:  [null as number | null],
    stockQuantity:  [null as number | null, [Validators.required, Validators.min(0)]],
    categoryId:     [null as number | null, Validators.required],
    material:       [''],
    productionTime: [''],
    deliveryOption: [''],
    imageUrls:      this.fb.array([this.fb.control('')])
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) this.editId = +idParam;

    this.categoryService.getAll().subscribe({
      next: res => {
        this.categories = res.data;
        if (this.editId) this.loadProduct();
        else this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  private loadProduct(): void {
    this.productService.getById(this.editId!).subscribe({
      next: res => {
        this.editProduct = res.data;
        const p = this.editProduct;
        this.form.patchValue({
          name: p.name,
          description: p.description ?? '',
          price: p.price,
          discountPrice: p.discountPrice ?? null,
          stockQuantity: p.stockQuantity,
          categoryId: p.categoryId,
          material: p.material ?? '',
          productionTime: p.productionTime ?? '',
          deliveryOption: p.deliveryOption ?? ''
        });
        // Reset image array with existing URLs
        this.imageUrls.clear();
        const urls = p.imageUrls?.length ? p.imageUrls : [''];
        urls.forEach(url => this.imageUrls.push(this.fb.control(url)));
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  get imageUrls(): FormArray { return this.form.get('imageUrls') as FormArray; }
  get f() { return this.form.controls; }
  get isEdit() { return !!this.editId; }

  addImageUrl(): void { this.imageUrls.push(this.fb.control('')); }
  removeImageUrl(i: number): void { if (this.imageUrls.length > 1) this.imageUrls.removeAt(i); }

  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    this.error = '';

    const raw = this.form.value;
    const req: any = {
      name:           raw.name,
      description:    raw.description,
      price:          raw.price,
      discountPrice:  raw.discountPrice || undefined,
      stockQuantity:  raw.stockQuantity,
      categoryId:     raw.categoryId,
      material:       raw.material,
      productionTime: raw.productionTime,
      deliveryOption: raw.deliveryOption,
      imageUrls:      (raw.imageUrls as string[]).filter(u => u?.trim())
    };

    const call = this.isEdit
      ? this.productService.update(this.editId!, req)
      : this.productService.create(req);

    call.subscribe({
      next: () => this.router.navigate(['/seller/products']),
      error: err => {
        this.error = err.error?.message || 'Failed to save product.';
        this.saving = false;
      }
    });
  }
}
