import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

import { ServicesModule } from '@modules/services/services.module';
import { BackendModule } from '@modules/backend/backend.module';
import { PortalComponent } from './portal/portal.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ProfileComponent } from './profile/profile.component';

@NgModule({
  declarations: [
    PortalComponent,
    HeaderComponent,
    FooterComponent,
    ProfileComponent
  ],
  imports: [
    RouterModule,
    ServicesModule,
    BackendModule,
    MatDividerModule,
    MatToolbarModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule
  ],
  exports: [
    PortalComponent,
    HeaderComponent,
    FooterComponent,
    ProfileComponent
  ]
})
export class LayoutModule { }
