import { NgModule } from '@angular/core';

import { ServicesModule } from 'src/app/modules/services/services.module';
import { HelpRoutingModule } from './help-routing.module';
import { HelpComponent } from './components/help/help.component';

@NgModule({
  declarations: [
    HelpComponent
  ],
  imports: [
    ServicesModule,
    HelpRoutingModule
  ]
})
export class HelpModule { }
