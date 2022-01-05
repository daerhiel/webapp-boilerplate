import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

import { ServicesModule } from 'src/app/modules/services/services.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SidenavActionsComponent } from './components/sidenav-actions/sidenav-actions.component';

export * from './components/dashboard/dashboard.component';

@NgModule({
  declarations: [
    DashboardComponent,
    SidenavActionsComponent
  ],
  imports: [
    ServicesModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatIconModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }
