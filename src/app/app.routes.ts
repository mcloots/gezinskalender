import { LoginRegisterComponent } from './auth/login-register/login-register.component';
import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AdminLayoutModule } from './layouts/admin-layout/admin-layout.module';
import { AuthGuard } from './auth/guards/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
    canActivate: [AuthGuard]
  },{
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },{
    path: 'login',
    component: LoginRegisterComponent,
    pathMatch: 'full'
  },{
    path: 'register',
    component: LoginRegisterComponent,
    pathMatch: 'full'
  },{
    path: 'logout',
    component: LoginRegisterComponent,
    pathMatch: 'full'
  }, {
    path: '',
    component: AdminLayoutComponent,
    children: [{
      path: '',
      loadChildren: () => AdminLayoutModule,
      canActivate: [AuthGuard]
    }]
  }
  ];