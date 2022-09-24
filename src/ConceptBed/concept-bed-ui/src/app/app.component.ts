import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Observable } from 'rxjs';

import { HistoryService, NavigationTarget } from '@modules/services/services.module';
import { LayoutService } from '@modules/layout/layout.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  @ViewChild('sidenav') sidenav?: MatSidenav;

  get navigations(): NavigationTarget[] { return this.history.navigations}

  get segment$(): Observable<NavigationTarget | null> { return this.history.segment$; }
  get activated$(): Observable<NavigationTarget[]> { return this.history.activated$; }
  get breadcrumbs$(): Observable<NavigationTarget[]> { return this.history.breadcrumbs$; }

  constructor(private history: HistoryService, public layout: LayoutService) {
  }
}
