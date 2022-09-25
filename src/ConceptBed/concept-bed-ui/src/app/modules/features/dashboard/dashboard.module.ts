import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

import { ServicesModule } from '@modules/services/services.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DashboardActionsComponent } from './components/dashboard-actions/dashboard-actions.component';
import { WeatherComponent } from './components/weather/weather.component';
import { WeatherActionsComponent } from './components/weather-actions/weather-actions.component';

export * from './components/dashboard/dashboard.component';

@NgModule({
  declarations: [
    DashboardComponent,
    DashboardActionsComponent,
    WeatherComponent,
    WeatherActionsComponent
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
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }
