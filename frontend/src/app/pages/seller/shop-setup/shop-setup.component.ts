import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ShopService } from '../../../services/shop.service';
import { SpinnerComponent } from '../../../shared/spinner/spinner.component';
import { Shop } from '../../../models/shop.model';

@Component({
  selector: 'app-shop-setup',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, SpinnerComponent],
  templateUrl: './shop-setup.component.html',
  styleUrl: './shop-setup.component.scss'
})
export class ShopSetupComponent implements OnInit {
  private fb = inject(FormBuilder);
  private shopService = inject(ShopService);

  shop: Shop | null = null;
  loading = true;
  saving = false;
  success = '';
  error = '';

  form = this.fb.group({
    name:         ['', [Validators.required, Validators.minLength(3)]],
    description:  [''],
    logoUrl:      [''],
    bannerUrl:    [''],
    contactEmail: ['', Validators.email],
    contactPhone: [''],
    address:      ['']
  });

  ngOnInit(): void {
    this.shopService.getMyShop().subscribe({
      next: res => {
        this.shop = res.data;
        this.form.patchValue(this.shop as any);
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    this.success = '';
    this.error = '';

    const req = this.form.value as any;

    const call = this.shop
      ? this.shopService.update(this.shop.id, req)
      : this.shopService.create(req);

    call.subscribe({
      next: res => {
        this.shop = res.data;
        this.success = this.shop ? 'Shop updated successfully!' : 'Shop created! Awaiting admin approval.';
        this.saving = false;
      },
      error: err => {
        this.error = err.error?.message || 'Failed to save shop.';
        this.saving = false;
      }
    });
  }

  get f() { return this.form.controls; }
  get isNew() { return !this.shop; }
}
