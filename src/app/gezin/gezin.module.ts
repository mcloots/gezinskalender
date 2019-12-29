import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GezinDashboardComponent } from './gezin-dashboard/gezin-dashboard.component';
import { SharedModule } from 'app/shared/shared.module';



@NgModule({
  declarations: [GezinDashboardComponent],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class GezinModule { }
