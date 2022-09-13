import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { AccountInfo } from '@azure/msal-browser';
import { BehaviorSubject, catchError, combineLatest, map, Observable, of, tap } from 'rxjs';

import { GraphClientService, UserIdentityApi } from '@modules/backend/backend.module';
import { BroadcastService, Subscriptions } from '@modules/services/services.module';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent implements OnDestroy {
  private readonly _subscriptions: Subscriptions = new Subscriptions;

  private readonly _profile = new BehaviorSubject<UserIdentityApi | null | undefined>(undefined);
  get profile$(): Observable<UserIdentityApi | null | undefined> { return this._profile.asObservable(); }
  get profile(): UserIdentityApi | null | undefined { return this._profile.value; }

  public readonly isLoading$: Observable<boolean> = combineLatest([this._profile]).pipe(map(x => x[0] === undefined));

  get account(): AccountInfo | null {
    const accounts = this.auth.instance.getAllAccounts();
    return accounts.length > 0 ? accounts[0] : null;
  }

  constructor(private auth: MsalService, private graph: GraphClientService, private broadcast: BroadcastService) {
    this._subscriptions.subscribe(this.graph.getMe().pipe(
      tap(profile => this._profile.next(profile ?? null)),
      catchError(e => (this.broadcast.excepion(e), of(undefined))),
    ));
  }

  ngOnDestroy(): void {
    this._profile.complete();
    this._subscriptions.unsubscribe();
  }

  onLogout(): void {
    this.auth.logoutRedirect({ account: this.account });
  }
}
