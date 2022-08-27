export interface Persistent {
  isPersistentComponent: boolean;
}

export function Persistent() {
  const propertyName = 'isPersistentComponent';

  return (target: object): void => {
    if (!Object.getOwnPropertyDescriptor(target, propertyName)) {
      Object.defineProperty(target, propertyName, { get: () => true });
    }
  }
}

export function isPersistent(content: object | null): content is Persistent {
  return (content as Persistent).isPersistentComponent !== undefined;
}
