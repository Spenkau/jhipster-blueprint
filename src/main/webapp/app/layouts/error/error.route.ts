import { Routes } from '@angular/router';

import ErrorComponent from './error.component';

export const errorRoute: Routes = [
  {
    path: 'error',
    component: ErrorComponent,
    title: 'Ошибка!',
  },
  {
    path: 'accessdenied',
    component: ErrorComponent,
    data: {
      errorMessage: 'Вы не авторизованы для доступа к странице.',
    },
    title: 'Ошибка!',
  },
  {
    path: '404',
    component: ErrorComponent,
    data: {
      errorMessage: 'Страница не существует.',
    },
    title: 'Ошибка!',
  },
  {
    path: '**',
    redirectTo: '/404',
  },
];
