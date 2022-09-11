import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LayoutService implements OnDestroy {
  private readonly sidenavOpened$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  static readonly sidenavOpenedName: string = 'layout.sidenav';

  isSidenavOpen: boolean = false;

  get sidenavOpened(): Observable<boolean> { return this.sidenavOpened$.asObservable(); }

  constructor() {
    this.isSidenavOpen = JSON.parse(localStorage.getItem(LayoutService.sidenavOpenedName) ?? 'false');
    this.sidenavOpened$.next(this.isSidenavOpen);
  }

  ngOnDestroy(): void {
    this.sidenavOpened$.complete();
  }

  toggleSidenav(isOpen?: boolean) {
    if (isOpen !== undefined) {
      this.isSidenavOpen = isOpen;
    } else {
      this.isSidenavOpen = !this.isSidenavOpen
    }
    localStorage.setItem(LayoutService.sidenavOpenedName, JSON.stringify(this.isSidenavOpen));
    this.sidenavOpened$.next(this.isSidenavOpen);
  }
}
