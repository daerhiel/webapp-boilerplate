import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MsalService } from '@azure/msal-angular';
import { AccountInfo } from '@azure/msal-browser';
import { BehaviorSubject, Observable } from 'rxjs';

import { TitleStrategyService } from '@app/extensions/title-strategy.service';
import { HistoryService } from '@modules/services/history.service';
import { NavigationTarget } from '@modules/services/services.module';
import { LayoutService } from '../layout.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  private readonly _isProfileOpen = new BehaviorSubject<boolean>(false);
  get isProfileOpen$(): Observable<boolean> { return this._isProfileOpen.asObservable(); }
  get isProfileOpen(): boolean { return this._isProfileOpen.value; }

  get title(): string { return TitleStrategyService.title; }
  get segments(): NavigationTarget[] { return this.history.getContainedHistory(); }

  get account(): AccountInfo | null {
    const accounts = this.auth.instance.getAllAccounts();
    return accounts.length > 0 ? accounts[0] : null;
  }

  constructor(private auth: MsalService, private history: HistoryService, public layout: LayoutService) {
  }

  public toggleProfile(isOpen?: boolean): void {
    this._isProfileOpen.next(isOpen ?? !this.isProfileOpen);
  }
}
