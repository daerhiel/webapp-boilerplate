import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

import { HistoryService } from '@modules/services/services.module';
import { LayoutService } from '@modules/layout/layout.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  @ViewChild('sidenav') sidenav?: MatSidenav;

  constructor(private history: HistoryService, public layout: LayoutService) {
  }

  ngOnInit(): void {
  }
}
