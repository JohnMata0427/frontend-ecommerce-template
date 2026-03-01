import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('../layouts/admin.layout').then((m) => m.AdminLayout),
    children: [
      {
        path: '',
        loadComponent: () => import('../pages/dashboard/dashboard.page').then((m) => m.Dashboard),
      },
      {
        path: 'categories',
        loadComponent: () =>
          import('../pages/categories/category-list.page').then((m) => m.CategoryList),
      },
      {
        path: 'subcategories',
        loadComponent: () =>
          import('../pages/subcategories/subcategory-list.page').then((m) => m.SubcategoryList),
      },
    ],
  },
];
