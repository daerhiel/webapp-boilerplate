import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { Container, Persistent } from '@modules/services/services.module';
import { ODataSource, WeatherForecast } from '@modules/backend/backend.module';
import { DashboardService } from '../../dashboard.service';

@Persistent() @Container()
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

  get data(): ODataSource<WeatherForecast> { return this.dashboard.data;}

  constructor(private dashboard: DashboardService) {
  }

  ngOnInit(): void {
    this.data.paginator = this.dataPages;
    this.data.sort = this.dataSort;
  }

  ngOnDestroy(): void {
    this.data.paginator = null;
    this.data.sort = null;
  }
}
