import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LayoutService implements OnDestroy {
  private readonly _isSidenavOpen: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  get isSidenavOpen$(): Observable<boolean> { return this._isSidenavOpen.asObservable(); }
  isSidenavOpen: boolean = false;
  static readonly sidenavOpenedName: string = 'layout.sidenav';

  constructor() {
    this.isSidenavOpen = JSON.parse(localStorage.getItem(LayoutService.sidenavOpenedName) ?? 'false');
    this._isSidenavOpen.next(this.isSidenavOpen);
  }

  ngOnDestroy(): void {
    this._isSidenavOpen.complete();
  }

  toggleSidenav(isOpen?: boolean) {
    if (isOpen !== undefined) {
      this.isSidenavOpen = isOpen;
    } else {
      this.isSidenavOpen = !this.isSidenavOpen
    }
    localStorage.setItem(LayoutService.sidenavOpenedName, JSON.stringify(this.isSidenavOpen));
    this._isSidenavOpen.next(this.isSidenavOpen);
  }
}
