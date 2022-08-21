import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';

import { ContentStateService, ODataSource, WeatherForecast } from '@modules/backend/backend.module';
import { DashboardService } from '../../dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  private readonly subscriptions: Subscription[] = [];

  displayedColumns: string[] = ['id', 'date', 'summary', 'temperature', 'status'];

  @ViewChild('dataPages', { static: true }) private dataPages?: MatPaginator;
  @ViewChild(MatSort, { static: true }) private dataSort?: MatSort;
  data: ODataSource<WeatherForecast> = new ODataSource(x => this.state.getWeatherForecast(x), x => WeatherForecast.buildQuery(x));

  constructor(private state: ContentStateService, private dashboard: DashboardService) {
  }

  ngOnInit(): void {
    this.data.paginator = this.dataPages;
    this.data.sort = this.dataSort;
  }

  ngOnDestroy(): void {
    while (this.subscriptions.length > 0) {
      this.subscriptions.shift()?.unsubscribe();
    }
    this.data.complete();
  }
}
