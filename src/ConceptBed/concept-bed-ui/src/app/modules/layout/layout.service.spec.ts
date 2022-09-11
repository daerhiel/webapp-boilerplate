import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

import { LayoutService } from './layout.service';

describe('LayoutService', () => {
  beforeEach(async () => {
    TestBed.configureTestingModule({}).compileComponents();
  });

  it('should be created', () => {
    const service = TestBed.inject(LayoutService);

    expect(service).toBeTruthy();
  });

  it('should default sidenav to closed', () => {
    localStorage.removeItem(LayoutService.sidenavOpenedName);
    const service = TestBed.inject(LayoutService);

    expect(service.isSidenavOpen).toBeFalse();
  });

  it('should emit default sidenav closed', async () => {
    localStorage.removeItem(LayoutService.sidenavOpenedName);
    const service = TestBed.inject(LayoutService);

    expect(await firstValueFrom(service.isSidenavOpen$)).toBeFalse();
  });

  it('should read sidenav open', () => {
    localStorage.setItem(LayoutService.sidenavOpenedName, JSON.stringify(true))
    const service = TestBed.inject(LayoutService);

    expect(service.isSidenavOpen).toBeTrue();
  });

  it('should emit sidenav open', async () => {
    localStorage.setItem(LayoutService.sidenavOpenedName, JSON.stringify(true))
    const service = TestBed.inject(LayoutService);

    expect(await firstValueFrom(service.isSidenavOpen$)).toBeTrue();
  });

  it('should read sidenav closed', () => {
    localStorage.setItem(LayoutService.sidenavOpenedName, JSON.stringify(false))
    const service = TestBed.inject(LayoutService);

    expect(service.isSidenavOpen).toBeFalse();
  });

  it('should emit sidenav closed', async () => {
    localStorage.setItem(LayoutService.sidenavOpenedName, JSON.stringify(false))
    const service = TestBed.inject(LayoutService);

    expect(await firstValueFrom(service.isSidenavOpen$)).toBeFalse();
  });

  it('should toggle sidenav open', async () => {
    localStorage.setItem(LayoutService.sidenavOpenedName, JSON.stringify(false))
    const service = TestBed.inject(LayoutService);

    expect(service.isSidenavOpen).toBeFalse();
    expect(await firstValueFrom(service.isSidenavOpen$)).toBeFalse();

    service.toggleSidenav();

    expect(service.isSidenavOpen).toBeTrue();
    expect(await firstValueFrom(service.isSidenavOpen$)).toBeTrue();
    expect(JSON.parse(localStorage.getItem(LayoutService.sidenavOpenedName) ?? 'false')).toBeTrue();
  });

  it('should toggle sidenav close', async () => {
    localStorage.setItem(LayoutService.sidenavOpenedName, JSON.stringify(true))
    const service = TestBed.inject(LayoutService);

    expect(service.isSidenavOpen).toBeTrue();
    expect(await firstValueFrom(service.isSidenavOpen$)).toBeTrue();

    service.toggleSidenav();

    expect(service.isSidenavOpen).toBeFalse();
    expect(await firstValueFrom(service.isSidenavOpen$)).toBeFalse();
    expect(JSON.parse(localStorage.getItem(LayoutService.sidenavOpenedName) ?? 'false')).toBeFalse();
  });

  it('should set sidenav open', async () => {
    const service = TestBed.inject(LayoutService);
    service.toggleSidenav(true);

    expect(service.isSidenavOpen).toBeTrue();
    expect(await firstValueFrom(service.isSidenavOpen$)).toBeTrue();
    expect(JSON.parse(localStorage.getItem(LayoutService.sidenavOpenedName) ?? 'false')).toBeTrue();
  });

  it('should set sidenav close', async () => {
    const service = TestBed.inject(LayoutService);
    service.toggleSidenav(false);

    expect(service.isSidenavOpen).toBeFalse();
    expect(await firstValueFrom(service.isSidenavOpen$)).toBeFalse();
    expect(JSON.parse(localStorage.getItem(LayoutService.sidenavOpenedName) ?? 'false')).toBeFalse();
  });
});
