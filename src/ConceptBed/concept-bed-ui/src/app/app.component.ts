import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MatSidenav } from '@angular/material/sidenav';
import { Subscription } from 'rxjs';

import { environment } from 'src/environments/environment';
import { ContentStateService } from './modules/backend/backend.module';
import { LayoutService } from './modules/layout/layout.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private readonly subscriptions: Subscription[] = [];

  public get title(): string { return this.title$.getTitle(); }

  @ViewChild('sidenav') sidenav?: MatSidenav;

  public constructor(private state: ContentStateService, private title$: Title, public layout: LayoutService) {
    this.title$.setTitle(environment.title);
  }

  public ngOnInit(): void {
  }

  public ngOnDestroy(): void {
    while (this.subscriptions.length > 0) {
      this.subscriptions.shift()?.unsubscribe();
    }
  }
}