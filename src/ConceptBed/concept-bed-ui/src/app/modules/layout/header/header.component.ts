import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MatAnchor } from '@angular/material/button';
import { MsalService } from '@azure/msal-angular';
import { AccountInfo } from '@azure/msal-browser';
import { Subscription } from 'rxjs';

import { LayoutService } from '../layout.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private readonly subscriptions: Subscription[] = [];

  isProfileOpen: boolean = false;

  get title(): string { return this.title$.getTitle(); }
  get account(): AccountInfo | null {
    const accounts = this.auth.instance.getAllAccounts();
    return accounts.length > 0 ? accounts[0] : null;
  }

  @ViewChild('profile', { static: true })
  profile?: MatAnchor;

  constructor(private auth: MsalService, private title$: Title, public layout: LayoutService) {
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    while (this.subscriptions.length > 0) {
      this.subscriptions.shift()?.unsubscribe();
    }
  }

  onProfileEscape(event: Event) {
    if (this.profile && !this.profile._elementRef.nativeElement.contains(event.target as Node)) {
      this.isProfileOpen = false;
    }
  }
}
