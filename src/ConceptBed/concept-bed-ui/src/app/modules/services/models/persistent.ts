import { Type } from "@angular/core";

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
