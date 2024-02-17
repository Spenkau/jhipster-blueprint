import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { ExampleComponent } from './list/example.component';
import { ExampleDetailComponent } from './detail/example-detail.component';
import { ExampleCopyComponent } from './copy/example-copy.component';
import { ExampleUpdateComponent } from './update/example-update.component';
import ExampleResolve from './route/example-routing-resolve.service';

const exampleRoute: Routes = [
  {
    path: '',
    component: ExampleComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ExampleDetailComponent,
    resolve: {
      example: ExampleResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/copy',
    component: ExampleCopyComponent,
    resolve: {
      example: ExampleResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ExampleUpdateComponent,
    resolve: {
      example: ExampleResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ExampleUpdateComponent,
    resolve: {
      example: ExampleResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default exampleRoute;
