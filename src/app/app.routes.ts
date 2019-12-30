import { LoginRegisterComponent } from './auth/login-register/login-register.component';
import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AdminLayoutModule } from './layouts/admin-layout/admin-layout.module';
import { AuthGuard } from './auth/guards/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { VerifyEmailComponent } from './auth/verify-email/verify-email.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { GezinDashboardComponent } from './gezin/gezin-dashboard/gezin-dashboard.component';
import { GezinModule } from './gezin/gezin.module';
import { GezinslidFormComponent } from './gezin/gezinslid-form/gezinslid-form.component';
import { ActiviteitFormComponent } from './activiteit/activiteit-form/activiteit-form.component';
import { ActiviteitDashboardComponent } from './activiteit/activiteit-dashboard/activiteit-dashboard.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'activiteit-dashboard',
    pathMatch: 'full',
    canActivate: [AuthGuard]
  }, {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  }, {
    path: 'login',
    component: LoginRegisterComponent,
    pathMatch: 'full'
  }, {
    path: 'register',
    component: LoginRegisterComponent,
    pathMatch: 'full'
  }, {
    path: 'logout',
    component: LoginRegisterComponent,
    pathMatch: 'full'
  }, {
    path: 'verify-email',
    component: VerifyEmailComponent
  }, {
    path: 'resetpassword',
    component: ResetPasswordComponent,
    pathMatch: 'full'
  }, {
    path: 'gezin-dashboard',
    component: GezinDashboardComponent,
    canActivate: [AuthGuard]
  }, {
    path: 'gezinslid-form',
    component: GezinslidFormComponent,
    canActivate: [AuthGuard]
  }, {
    path: 'activiteit-dashboard',
    component: ActiviteitDashboardComponent,
    canActivate: [AuthGuard]
  }, {
    path: 'activiteit-form',
    component: ActiviteitFormComponent,
    canActivate: [AuthGuard]
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