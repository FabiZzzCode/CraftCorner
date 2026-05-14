import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  auth = inject(AuthService);
  cart = inject(CartService);
  router = inject(Router);

  logout(): void {
    this.auth.logout();
  }

  get dashboardRoute(): string {
    if (this.auth.isAdmin()) return '/admin/dashboard';
    if (this.auth.isSeller()) return '/seller/dashboard';
    return '/profile';
  }
}
