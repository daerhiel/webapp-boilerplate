import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TitleResolverService } from '@app/extensions/title-resolver.service';
import { HelpComponent } from './components/help/help.component';

const routes: Routes = [
  { path: '', title: TitleResolverService, component: HelpComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HelpRoutingModule { }
