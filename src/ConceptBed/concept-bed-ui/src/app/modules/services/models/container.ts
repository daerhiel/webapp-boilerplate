import { Type } from "@angular/core";

export interface Containment {
  containmentMode: boolean;
}

export function Container(containment?: Partial<Containment>) {
  const propertyName = 'containmentMode';

  return (target: object): void => {
    const mode = containment?.containmentMode ?? true;
    if (!Object.getOwnPropertyDescriptor(target, propertyName)) {
      Object.defineProperty(target, propertyName, { get: () => mode });
    }
  }
}

export function isContainer(component: Type<any> | object | null): boolean {
  return (component as Containment)?.containmentMode;
}
