import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LayoutService implements OnDestroy {
  static readonly sidenavOpenedName: string = 'layout.sidenav';

  private readonly _isSidenavOpen = new BehaviorSubject<boolean>(false);
  get isSidenavOpen$(): Observable<boolean> { return this._isSidenavOpen.asObservable(); }
  get isSidenavOpen(): boolean { return this._isSidenavOpen.value; }

  constructor() {
    this._isSidenavOpen.next(JSON.parse(localStorage.getItem(LayoutService.sidenavOpenedName) ?? 'false'));
  }

  ngOnDestroy(): void {
    this._isSidenavOpen.complete();
  }

  toggleSidenav(isOpen?: boolean) {
    this._isSidenavOpen.next(isOpen ?? !this.isSidenavOpen);
    localStorage.setItem(LayoutService.sidenavOpenedName, JSON.stringify(this.isSidenavOpen));
  }
}
