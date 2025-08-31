import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login').then(m => m.Login),
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./signup/signup').then(m => m.Signup),
  },
  {
    path: 'pick',
    loadComponent: () =>
      import('./pick/pick').then(m => m.Pick),
  },
    {
    path: 'picks-summary',
    loadComponent: () =>
      import('./picks-summary/picks-summary').then(m => m.PicksSummary),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
