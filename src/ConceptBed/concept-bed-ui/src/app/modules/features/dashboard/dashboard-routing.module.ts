import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';

import { TitleResolverService } from '@app/extensions/title-resolver.service';
import { WeatherResolver } from '@modules/backend/backend.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SidenavActionsComponent } from './components/sidenav-actions/sidenav-actions.component';
import { WeatherComponent } from './components/weather/weather.component';

const routes: Routes = [
  {
    path: '', component: DashboardComponent, title: TitleResolverService, canActivate: [MsalGuard], children: [
      { path: ':id', component: WeatherComponent, title: TitleResolverService, resolve: { weather: WeatherResolver }, canActivate: [MsalGuard] },
    ]
  },
  { path: '', component: SidenavActionsComponent, canActivate: [MsalGuard], outlet: 'sidenav.actions' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
