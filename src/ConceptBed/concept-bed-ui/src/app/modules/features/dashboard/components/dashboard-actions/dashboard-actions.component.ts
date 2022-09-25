import { Component } from '@angular/core';

import { DashboardService } from '../../dashboard.service';

@Component({
  selector: 'app-dashboard-actions',
  templateUrl: './dashboard-actions.component.html',
  styleUrls: ['./dashboard-actions.component.scss']
})
export class DashboardActionsComponent {
  constructor(private dashboard: DashboardService) {
  }
}
