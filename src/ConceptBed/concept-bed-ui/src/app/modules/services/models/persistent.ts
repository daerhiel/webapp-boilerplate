import { ActivatedRouteSnapshot } from "@angular/router";

export enum PersistanceMode {
  Global,
  Parent
}

export interface Persistance {
  persistanceMode: PersistanceMode;
}

export function Persistent(persistance?: Partial<Persistance>) {
  const propertyName = 'persistanceMode';

  return (target: object): void => {
    const mode = persistance?.persistanceMode ?? PersistanceMode.Global;
    if (!Object.getOwnPropertyDescriptor(target, propertyName)) {
      Object.defineProperty(target, propertyName, { get: () => mode });
    }
  }
}

export function isPersistent(snapshot: ActivatedRouteSnapshot): boolean {
  const component: any = snapshot.component;
  switch ((component as Persistance).persistanceMode) {
    case PersistanceMode.Parent:
      return snapshot.children.length > 0;
    case PersistanceMode.Global:
      return true;
    default:
      return false;
  }
}
