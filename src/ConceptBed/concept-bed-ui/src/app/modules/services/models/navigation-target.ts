import { Type } from "@angular/core";
import { ActivatedRouteSnapshot, Data, Route, UrlSegment } from "@angular/router";

export function getPath(snapshots: ActivatedRouteSnapshot[]): UrlSegment[] {
  return snapshots.reduce<UrlSegment[]>((x, y) => (x.push(...y.url), x), []);
}

export class NavigationTarget {
  private readonly segments: UrlSegment[];
  private data: Data;

  component: Type<any> | null;
  routeConfig: Route | null;

  get title(): string | undefined {
    for (const key of Object.getOwnPropertySymbols(this.data)) {
      return this.data[key];
    }
    return undefined;
  }

  get path(): string[] { return [''].concat(this.segments.map(x => x.path)); }

  constructor(snapshot: ActivatedRouteSnapshot) {
    if (!snapshot) {
      throw new ReferenceError(`Unable initialize navigation target: ${'snapshot'}.`);
    }
    this.segments = getPath(snapshot.pathFromRoot);
    this.component = snapshot.component;
    this.routeConfig = snapshot.routeConfig;
    this.data = snapshot.data;
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
}
