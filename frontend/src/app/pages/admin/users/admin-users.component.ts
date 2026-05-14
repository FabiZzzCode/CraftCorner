import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { SpinnerComponent } from '../../../shared/spinner/spinner.component';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule, SpinnerComponent],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.scss'
})
export class AdminUsersComponent implements OnInit {
  private userService = inject(UserService);
  private authService = inject(AuthService);

  users: User[] = [];
  totalElements = 0;
  page = 0;
  pageSize = 15;
  loading = true;
  actionId: number | null = null;

  get currentUserId() { return this.authService.currentUser()?.userId; }

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.userService.getAll(this.page, this.pageSize).subscribe({
      next: res => {
        this.users = res.data.content;
        this.totalElements = res.data.totalElements;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  toggleBlock(user: User): void {
    this.actionId = user.id;
    const call = user.isBlocked
      ? this.userService.unblock(user.id)
      : this.userService.block(user.id);
    call.subscribe({
      next: () => { user.isBlocked = !user.isBlocked; this.actionId = null; },
      error: () => { this.actionId = null; }
    });
  }

  delete(id: number): void {
    if (!confirm('Delete this user permanently?')) return;
    this.actionId = id;
    this.userService.delete(id).subscribe({
      next: () => { this.users = this.users.filter(u => u.id !== id); this.totalElements--; this.actionId = null; },
      error: () => { this.actionId = null; }
    });
  }

  get totalPages() { return Math.ceil(this.totalElements / this.pageSize); }
  changePage(p: number) { this.page = p; this.load(); }
}
