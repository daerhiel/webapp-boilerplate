import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { guard, Persistent } from '@modules/services/services.module';
import { ContentStateService, isResult, ODataSource, WeatherForecast } from '@modules/backend/backend.module';
import { DashboardService } from '../../dashboard.service';

@Persistent()
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['id', 'date', 'summary', 'temperature', 'status'];

  @ViewChild('dataPages', { static: true }) private dataPages?: MatPaginator;
  @ViewChild(MatSort, { static: true }) private dataSort?: MatSort;

  readonly data: ODataSource<WeatherForecast> = new ODataSource(x => this.state.getWeatherForecast(x).pipe(
    guard(isResult),
  ), x => WeatherForecast.buildQuery(x));

  constructor(private state: ContentStateService, private dashboard: DashboardService) {
  }

  ngOnInit(): void {
    this.data.paginator = this.dataPages;
    this.data.sort = this.dataSort;
  }

  ngOnDestroy(): void {
    this.data.complete();
  }
}
