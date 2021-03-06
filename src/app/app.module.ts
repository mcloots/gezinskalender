import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { LoginRegisterComponent } from './auth/login-register/login-register.component';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreModule } from '@angular/fire/firestore';
import { SharedModule } from './shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { CheckPasswordDirective } from './auth/directives/check-password.directive';
import { VerifyEmailComponent } from './auth/verify-email/verify-email.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { GezinModule } from './gezin/gezin.module';
import { ActiviteitDashboardComponent } from './activiteit/activiteit-dashboard/activiteit-dashboard.component';
import { ActiviteitFormComponent } from './activiteit/activiteit-form/activiteit-form.component';
import { MAT_DATE_LOCALE } from '@angular/material/core';

@NgModule({
  declarations: [
    AppComponent,
    LoginRegisterComponent,
    AdminLayoutComponent,
    CheckPasswordDirective,
    VerifyEmailComponent,
    ResetPasswordComponent,
    ActiviteitDashboardComponent,
    ActiviteitFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    AngularFirestoreModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    BrowserAnimationsModule,
    GezinModule
  ],
  providers: [AngularFirestore,
    { provide: MAT_DATE_LOCALE, useValue: 'nl-BE' }],
  bootstrap: [AppComponent]
})
export class AppModule { }
