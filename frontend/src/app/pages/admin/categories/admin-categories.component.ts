import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../../services/category.service';
import { SpinnerComponent } from '../../../shared/spinner/spinner.component';
import { Category } from '../../../models/category.model';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, SpinnerComponent],
  templateUrl: './admin-categories.component.html',
  styleUrl: './admin-categories.component.scss'
})
export class AdminCategoriesComponent implements OnInit {
  private fb = inject(FormBuilder);
  private categoryService = inject(CategoryService);

  categories: Category[] = [];
  loading = true;
  saving = false;
  deletingId: number | null = null;
  editingId: number | null = null;
  formError = '';
  formSuccess = '';

  form = this.fb.group({
    name:        ['', [Validators.required, Validators.minLength(2)]],
    description: [''],
    imageUrl:    ['']
  });

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.categoryService.getAll().subscribe({
      next: res => { this.categories = res.data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  startEdit(cat: Category): void {
    this.editingId = cat.id;
    this.formError = '';
    this.formSuccess = '';
    this.form.patchValue({ name: cat.name, description: cat.description ?? '', imageUrl: cat.imageUrl ?? '' });
  }

  cancelEdit(): void {
    this.editingId = null;
    this.form.reset();
  }

  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    this.formError = '';
    this.formSuccess = '';

    const req = this.form.value as any;
    const call = this.editingId
      ? this.categoryService.update(this.editingId, req)
      : this.categoryService.create(req);

    call.subscribe({
      next: res => {
        if (this.editingId) {
          const idx = this.categories.findIndex(c => c.id === this.editingId);
          if (idx !== -1) this.categories[idx] = res.data;
          this.formSuccess = 'Category updated!';
        } else {
          this.categories.unshift(res.data);
          this.formSuccess = 'Category created!';
        }
        this.editingId = null;
        this.form.reset();
        this.saving = false;
      },
      error: err => {
        this.formError = err.error?.message || 'Failed to save.';
        this.saving = false;
      }
    });
  }

  delete(id: number): void {
    if (!confirm('Delete this category?')) return;
    this.deletingId = id;
    this.categoryService.delete(id).subscribe({
      next: () => { this.categories = this.categories.filter(c => c.id !== id); this.deletingId = null; },
      error: () => { this.deletingId = null; }
    });
  }

  get f() { return this.form.controls; }
}
