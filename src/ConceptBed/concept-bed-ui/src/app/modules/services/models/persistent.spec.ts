import { Persistance, PersistanceMode, Persistent } from "./persistent";

@Persistent()
class DefaultType { }

@Persistent({})
class EmptyType { }

@Persistent({ persistanceMode: PersistanceMode.Global })
class GlobalType { }

@Persistent({ persistanceMode: PersistanceMode.Parent })
class ParentType { }

describe('Persistent', () => {
  it('should create an instance', () => {
    const decorator: (target: object) => void = Persistent();

    expect(decorator).toBeTruthy();
  });

  it('should add default persistance attributes', () => {
    const decorator: (target: object) => void = Persistent();
    const target = {};
    decorator(target);

    expect((target as Persistance).persistanceMode).toEqual(PersistanceMode.Global);
  });

  it('should add empty persistance attributes', () => {
    const decorator: (target: object) => void = Persistent({});
    const target = {};
    decorator(target);

    expect((target as Persistance).persistanceMode).toEqual(PersistanceMode.Global);
  });

  it('should add global persistance attributes', () => {
    const decorator: (target: object) => void = Persistent({ persistanceMode: PersistanceMode.Global });
    const target = {};
    decorator(target);

    expect((target as Persistance).persistanceMode).toEqual(PersistanceMode.Global);
  });

  it('should add parent persistance attributes', () => {
    const decorator: (target: object) => void = Persistent({ persistanceMode: PersistanceMode.Parent });
    const target = {};
    decorator(target);

    expect((target as Persistance).persistanceMode).toEqual(PersistanceMode.Parent);
  });

  it('should decorate default persistance attributes', () => {
    expect((DefaultType as any as Persistance).persistanceMode).toEqual(PersistanceMode.Global);
  });

  it('should decorate empty persistance attributes', () => {
    expect((EmptyType as any as Persistance).persistanceMode).toEqual(PersistanceMode.Global);
  });

  it('should decorate global persistance attributes', () => {
    expect((GlobalType as any as Persistance).persistanceMode).toEqual(PersistanceMode.Global);
  });

  it('should decorate parent persistance attributes', () => {
    expect((ParentType as any as Persistance).persistanceMode).toEqual(PersistanceMode.Parent);
  });
});
