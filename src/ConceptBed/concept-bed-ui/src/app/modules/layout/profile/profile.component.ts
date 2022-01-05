import { Component, OnDestroy, OnInit } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { AccountInfo } from '@azure/msal-browser';
import { catchError, of, Subscription, tap } from 'rxjs';

import { GraphClientService, UserIdentityApi } from 'src/app/modules/backend/backend.module';
import { BroadcastService } from 'src/app/modules/services/services.module';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  private readonly subscriptions: Subscription[] = [];

  public profile: UserIdentityApi | undefined;
  public isQuerying: boolean = false;

  public get account(): AccountInfo | null {
    const accounts = this.auth.instance.getAllAccounts();
    return accounts.length > 0 ? accounts[0] : null;
  }

  public constructor(private auth: MsalService, private graph: GraphClientService, private broadcast: BroadcastService) {
    this.isQuerying = true;
    this.subscriptions.push(this.graph.getMe().pipe(
      tap(() => this.isQuerying = false),
      catchError(e => (this.broadcast.excepion(e), of(undefined)))
    ).subscribe(profile => this.profile = profile));
  }

  public ngOnInit(): void {
  }

  public ngOnDestroy(): void {
    while (this.subscriptions.length > 0) {
      this.subscriptions.shift()?.unsubscribe();
    }
  }

  public onLogout(): void {
    this.auth.logoutRedirect({ account: this.account });
  }
}
