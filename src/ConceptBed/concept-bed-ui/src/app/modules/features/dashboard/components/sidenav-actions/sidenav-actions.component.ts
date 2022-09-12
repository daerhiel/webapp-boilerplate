import { Component, OnInit } from '@angular/core';

import { DashboardService } from '../../dashboard.service';

@Component({
  selector: 'app-sidenav-actions',
  templateUrl: './sidenav-actions.component.html',
  styleUrls: ['./sidenav-actions.component.scss']
})
export class SidenavActionsComponent {
  constructor(private dashboard: DashboardService) {
  }
}
