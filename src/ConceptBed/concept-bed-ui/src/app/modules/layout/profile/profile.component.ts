import { Component, OnDestroy, OnInit } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { AccountInfo } from '@azure/msal-browser';
import { catchError, of, Subscription, tap } from 'rxjs';

import { GraphClientService, UserIdentityApi } from '@modules/backend/backend.module';
import { BroadcastService } from '@modules/services/services.module';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  private readonly subscriptions: Subscription[] = [];

  profile: UserIdentityApi | undefined;
  isQuerying: boolean = false;

  get account(): AccountInfo | null {
    const accounts = this.auth.instance.getAllAccounts();
    return accounts.length > 0 ? accounts[0] : null;
  }

  constructor(private auth: MsalService, private graph: GraphClientService, private broadcast: BroadcastService) {
    this.isQuerying = true;
    this.subscriptions.push(this.graph.getMe().pipe(
      tap(() => this.isQuerying = false),
      catchError(e => (this.broadcast.excepion(e), of(undefined)))
    ).subscribe(profile => this.profile = profile));
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    while (this.subscriptions.length > 0) {
      this.subscriptions.shift()?.unsubscribe();
    }
  }

  onLogout(): void {
    this.auth.logoutRedirect({ account: this.account });
  }
}
