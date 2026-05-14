import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopService } from '../../../services/shop.service';
import { SpinnerComponent } from '../../../shared/spinner/spinner.component';
import { Shop } from '../../../models/shop.model';

@Component({
  selector: 'app-admin-shops',
  standalone: true,
  imports: [CommonModule, SpinnerComponent],
  templateUrl: './admin-shops.component.html',
  styleUrl: './admin-shops.component.scss'
})
export class AdminShopsComponent implements OnInit {
  private shopService = inject(ShopService);

  shops: Shop[] = [];
  totalElements = 0;
  page = 0;
  pageSize = 15;
  loading = true;
  actionId: number | null = null;

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.shopService.getAll(this.page, this.pageSize).subscribe({
      next: res => {
        this.shops = res.data.content;
        this.totalElements = res.data.totalElements;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  approve(shop: Shop): void {
    this.actionId = shop.id;
    this.shopService.approve(shop.id).subscribe({
      next: () => { shop.status = 'APPROVED'; this.actionId = null; },
      error: () => { this.actionId = null; }
    });
  }

  reject(shop: Shop): void {
    if (!confirm(`Reject shop "${shop.name}"?`)) return;
    this.actionId = shop.id;
    this.shopService.reject(shop.id).subscribe({
      next: () => { shop.status = 'REJECTED'; this.actionId = null; },
      error: () => { this.actionId = null; }
    });
  }

  delete(id: number): void {
    if (!confirm('Delete this shop permanently?')) return;
    this.actionId = id;
    this.shopService.delete(id).subscribe({
      next: () => { this.shops = this.shops.filter(s => s.id !== id); this.totalElements--; this.actionId = null; },
      error: () => { this.actionId = null; }
    });
  }

  get totalPages() { return Math.ceil(this.totalElements / this.pageSize); }
  changePage(p: number) { this.page = p; this.load(); }
}
