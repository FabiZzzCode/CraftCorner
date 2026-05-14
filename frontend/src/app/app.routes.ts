import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [

  // ── Public / Buyer browsing ────────────────────────────
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'products',
    loadComponent: () => import('./pages/products/products.component').then(m => m.ProductsComponent)
  },
  {
    path: 'products/:id',
    loadComponent: () => import('./pages/product-detail/product-detail.component').then(m => m.ProductDetailComponent)
  },
  {
    path: 'shops',
    loadComponent: () => import('./pages/shops/shops.component').then(m => m.ShopsComponent)
  },
  {
    path: 'shops/:id',
    loadComponent: () => import('./pages/shop-detail/shop-detail.component').then(m => m.ShopDetailComponent)
  },

  // ── Auth ───────────────────────────────────────────────
  {
    path: 'auth/login',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'auth/register',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/auth/register/register.component').then(m => m.RegisterComponent)
  },

  // ── Buyer ──────────────────────────────────────────────
  {
    path: 'cart',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/buyer/cart/cart.component').then(m => m.CartComponent)
  },
  {
    path: 'checkout',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/buyer/checkout/checkout.component').then(m => m.CheckoutComponent)
  },
  {
    path: 'orders',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/buyer/orders/orders.component').then(m => m.OrdersComponent)
  },
  {
    path: 'orders/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/buyer/order-detail/order-detail.component').then(m => m.OrderDetailComponent)
  },
  {
    path: 'wishlist',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/buyer/wishlist/wishlist.component').then(m => m.WishlistComponent)
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/buyer/profile/profile.component').then(m => m.ProfileComponent)
  },

  // ── Seller ─────────────────────────────────────────────
  {
    path: 'seller',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ROLE_SELLER'] },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/seller/dashboard/seller-dashboard.component').then(m => m.SellerDashboardComponent)
      },
      {
        path: 'shop',
        loadComponent: () => import('./pages/seller/shop-setup/shop-setup.component').then(m => m.ShopSetupComponent)
      },
      {
        path: 'products',
        loadComponent: () => import('./pages/seller/products/seller-products.component').then(m => m.SellerProductsComponent)
      },
      {
        path: 'products/add',
        loadComponent: () => import('./pages/seller/product-form/product-form.component').then(m => m.ProductFormComponent)
      },
      {
        path: 'products/edit/:id',
        loadComponent: () => import('./pages/seller/product-form/product-form.component').then(m => m.ProductFormComponent)
      },
      {
        path: 'orders',
        loadComponent: () => import('./pages/seller/orders/seller-orders.component').then(m => m.SellerOrdersComponent)
      }
    ]
  },

  // ── Admin ──────────────────────────────────────────────
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ROLE_ADMIN'] },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/admin/dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./pages/admin/users/admin-users.component').then(m => m.AdminUsersComponent)
      },
      {
        path: 'shops',
        loadComponent: () => import('./pages/admin/shops/admin-shops.component').then(m => m.AdminShopsComponent)
      },
      {
        path: 'products',
        loadComponent: () => import('./pages/admin/products/admin-products.component').then(m => m.AdminProductsComponent)
      },
      {
        path: 'categories',
        loadComponent: () => import('./pages/admin/categories/admin-categories.component').then(m => m.AdminCategoriesComponent)
      },
      {
        path: 'orders',
        loadComponent: () => import('./pages/admin/orders/admin-orders.component').then(m => m.AdminOrdersComponent)
      }
    ]
  },

  { path: '**', redirectTo: '' }
];
