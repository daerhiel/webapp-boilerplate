import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SidenavActionsComponent } from './components/sidenav-actions/sidenav-actions.component';

const routes: Routes = [
  { path: '', component: DashboardComponent, canActivate: [MsalGuard] },
  { path: '', component: SidenavActionsComponent, canActivate: [MsalGuard], outlet: 'sidenav.actions' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
