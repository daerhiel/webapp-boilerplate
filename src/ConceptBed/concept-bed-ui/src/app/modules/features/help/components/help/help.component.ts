import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent implements OnInit, OnDestroy {
  private readonly subscriptions: Subscription[] = [];

  public get title(): string { return this.title$.getTitle(); }

  public constructor(private title$: Title) {
  }

  public ngOnInit(): void {
  }

  public ngOnDestroy(): void {
    while (this.subscriptions.length > 0) {
      this.subscriptions.shift()?.unsubscribe();
    }
  }
}
