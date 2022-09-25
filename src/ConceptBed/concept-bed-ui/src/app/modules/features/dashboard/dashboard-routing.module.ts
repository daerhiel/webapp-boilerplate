import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';

import { TitleResolverService } from '@app/extensions/title-resolver.service';
import { WeatherResolver } from '@modules/backend/backend.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DashboardActionsComponent } from './components/dashboard-actions/dashboard-actions.component';
import { WeatherComponent } from './components/weather/weather.component';
import { WeatherActionsComponent } from './components/weather-actions/weather-actions.component';

const routes: Routes = [
  {
    path: '', title: TitleResolverService, children: [
      { path: '', pathMatch: 'full', component: DashboardComponent, title: TitleResolverService, canActivate: [MsalGuard] },
      { path: ':id', pathMatch: 'full', component: WeatherComponent, title: TitleResolverService, resolve: { weather: WeatherResolver }, canActivate: [MsalGuard] }
    ]
  },
  { path: '', component: DashboardActionsComponent, canActivate: [MsalGuard], outlet: 'sidenav.actions' },
  { path: ':id', component: WeatherActionsComponent, canActivate: [MsalGuard], outlet: 'sidenav.actions' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
