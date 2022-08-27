import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MatAnchor } from '@angular/material/button';
import { MsalService } from '@azure/msal-angular';
import { AccountInfo } from '@azure/msal-browser';

import { HistoryService } from '@modules/services/history.service';
import { NavigationTarget } from '@modules/services/services.module';
import { LayoutService } from '../layout.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isProfileOpen: boolean = false;

  get title(): string { return this.title$.getTitle(); }
  get account(): AccountInfo | null {
    const accounts = this.auth.instance.getAllAccounts();
    return accounts.length > 0 ? accounts[0] : null;
  }

  get segments(): NavigationTarget[] { return this.history.getContainedHistory(); }

  @ViewChild('profile', { static: true })
  profile?: MatAnchor;

  constructor(private auth: MsalService, private title$: Title, private history: HistoryService, public layout: LayoutService) {
  }

  ngOnInit(): void {
  }

  onProfileEscape(event: Event) {
    if (this.profile && !this.profile._elementRef.nativeElement.contains(event.target as Node)) {
      this.isProfileOpen = false;
    }
  }
}
