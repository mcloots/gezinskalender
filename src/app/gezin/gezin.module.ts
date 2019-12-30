import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GezinDashboardComponent } from './gezin-dashboard/gezin-dashboard.component';
import { SharedModule } from 'app/shared/shared.module';
import { GezinslidFormComponent } from './gezinslid-form/gezinslid-form.component';



@NgModule({
  declarations: [GezinDashboardComponent, GezinslidFormComponent],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class GezinModule { }
