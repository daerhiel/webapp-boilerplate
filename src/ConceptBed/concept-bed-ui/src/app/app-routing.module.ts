import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  { path: '', loadChildren: () => import('./modules/features/dashboard/dashboard.module').then(m => m.DashboardModule) },
  { path: 'help', loadChildren: () => import('./modules/features/help/help.module').then(m => m.HelpModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { anchorScrolling: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
