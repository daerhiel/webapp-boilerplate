import { Component, OnDestroy, OnInit } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { AccountInfo } from '@azure/msal-browser';
import { catchError, of, tap } from 'rxjs';

import { GraphClientService, UserIdentityApi } from '@modules/backend/backend.module';
import { BroadcastService, Subscriptions } from '@modules/services/services.module';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  private readonly subscriptions: Subscriptions = new Subscriptions;

  profile: UserIdentityApi | undefined;
  isQuerying: boolean = false;

  get account(): AccountInfo | null {
    const accounts = this.auth.instance.getAllAccounts();
    return accounts.length > 0 ? accounts[0] : null;
  }

  constructor(private auth: MsalService, private graph: GraphClientService, private broadcast: BroadcastService) {
    this.isQuerying = true;
    this.subscriptions.subscribe(this.graph.getMe().pipe(
      tap(profile => this.profile = profile),
      catchError(e => (this.broadcast.excepion(e), of(undefined))),
      tap(() => this.isQuerying = false)
    ));
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onLogout(): void {
    this.auth.logoutRedirect({ account: this.account });
  }
}
