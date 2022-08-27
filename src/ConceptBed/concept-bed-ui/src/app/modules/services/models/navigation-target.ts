import { Type } from "@angular/core";
import { ActivatedRouteSnapshot, Data, Route, UrlSegment } from "@angular/router";
import { Observable, of } from "rxjs";

export function getPath(snapshots: ActivatedRouteSnapshot[]): UrlSegment[] {
  return snapshots.reduce<UrlSegment[]>((x, y) => (x.push(...y.url), x), []);
}

const RouteTitle = Symbol('RouteTitle');
export class NavigationTarget {
  private readonly segments: UrlSegment[];
  private data: Data;

  component: Type<any> | null;
  routeConfig: Route | null;

  get title(): string { return this.data[RouteTitle]}
  get state(): any { return this.data['state']; }
  get path(): string[] { return [''].concat(this.segments.map(x => x.path)); }

  constructor(snapshot: ActivatedRouteSnapshot) {
    if (snapshot) {
      this.component = snapshot.component;
      this.segments = getPath(snapshot.pathFromRoot);
      this.data = snapshot.data;
      this.routeConfig = snapshot.routeConfig;
    } else {
      throw new ReferenceError(`Unable initialize navigation target.`);
    }
  }

  isMatch(target: NavigationTarget | UrlSegment[] | undefined | null): boolean {
    if (target instanceof NavigationTarget) {
      target = target.segments;
    }
    if (this.segments.length !== target?.length) {
      return false;
    }
    for (let i = 0; i < target.length; i++) {
      if (this.segments[i] !== target[i]) {
        return false;
      }
    }
    return true;
  }

  update(snapshot: ActivatedRouteSnapshot | undefined | null) {
    if (snapshot) {
      if (!this.component) {
        this.component = snapshot.component;
        this.data = snapshot.data;
      }
      if (!this.routeConfig) {
        this.routeConfig = snapshot.routeConfig;
      }
    }
  }

  buildTitle(): Observable<string> | Promise<string> {
    return of("test");
  }
}
