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

  /**
   * Check id the navigation target is has the same location information or it is in the same location.
   * @param navigation The navigation or location to check the current navigation against.
   * @returns True if the location of a current navigation is the same; otherwise, false.
   */
  isMatch(navigation: NavigationTarget | UrlSegment[] | null | undefined): boolean {
    if (navigation instanceof NavigationTarget) {
      navigation = navigation.segments;
    }
    if (this.segments.length !== navigation?.length) {
      return false;
    }
    for (let i = 0; i < navigation.length; i++) {
      const source = this.segments[i];
      const target = navigation[i];
      if (source.path !== target.path) {
        return false;
      }
      const sources = source.parameterMap.keys;
      const targets = target.parameterMap.keys;
      if (sources.length !== targets.length) {
        return false;
      }
      for (let j = 0; j < sources.length; j++) {
        if (sources[j] !== targets[j]) {
          return false;
        }
      }
      for (const name of sources) {
        if (source.parameterMap.get(name) !== target.parameterMap.get(name)) {
          return false;
        }
      }
    }
    return true;
  }

  update(snapshot: ActivatedRouteSnapshot | null | undefined) {
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
