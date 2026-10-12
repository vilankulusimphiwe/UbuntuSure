import { Routes } from '@angular/router';

import { Administration } from './features/administration/administration.component';
import { Claims } from './features/claims/claims.component';
import { Customers } from './features/customers/customers.component';
import { Dashboard } from './features/dashboard/dashboard.component';
import { Documents } from './features/documents/documents.component';
import { Login } from './features/login/login.component';
import { Payments } from './features/payments/payments.component';
import { Policies } from './features/policies/policies.component';
import { Quotes } from './features/quotes/quotes.component';
import { Reports } from './features/reports/reports.component';
import { MainLayout } from './layout/main-layout/main-layout.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  {
    path: 'login',
    component: Login,
    title: 'Sign in · UbuntuSure Insurance',
  },
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: 'dashboard',
        component: Dashboard,
        title: 'Dashboard · UbuntuSure Insurance',
      },
      {
        path: 'customers',
        component: Customers,
        title: 'Customers · UbuntuSure Insurance',
      },
      {
        path: 'quotes',
        component: Quotes,
        title: 'Quotes · UbuntuSure Insurance',
      },
      {
        path: 'policies',
        component: Policies,
        title: 'Policies · UbuntuSure Insurance',
      },
      {
        path: 'claims',
        component: Claims,
        title: 'Claims · UbuntuSure Insurance',
      },
      {
        path: 'payments',
        component: Payments,
        title: 'Payments · UbuntuSure Insurance',
      },
      {
        path: 'documents',
        component: Documents,
        title: 'Documents · UbuntuSure Insurance',
      },
      {
        path: 'reports',
        component: Reports,
        title: 'Reports · UbuntuSure Insurance',
      },
      {
        path: 'administration',
        component: Administration,
        title: 'Administration · UbuntuSure Insurance',
      },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
