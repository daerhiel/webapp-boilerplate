import { Container, Containment } from "./container";

@Container()
class DefaultType { }

@Container({})
class EmptyType { }

@Container({ containmentMode: false })
class RegularType { }

@Container({ containmentMode: true })
class ContainerType { }

describe('Container', () => {
  it('should create', () => {
    const decorator: (target: object) => void = Container();

    expect(decorator).toBeTruthy();
  });

  it('should add default containment attributes', () => {
    const decorator: (target: object) => void = Container();
    const target = {};
    decorator(target);

    expect((target as Containment).containmentMode).toEqual(true);
  });

  it('should add empty containment attributes', () => {
    const decorator: (target: object) => void = Container({});
    const target = {};
    decorator(target);

    expect((target as Containment).containmentMode).toEqual(true);
  });

  it('should add global containment attributes', () => {
    const decorator: (target: object) => void = Container({ containmentMode: false });
    const target = {};
    decorator(target);

    expect((target as Containment).containmentMode).toEqual(false);
  });

  it('should add parent containment attributes', () => {
    const decorator: (target: object) => void = Container({ containmentMode: true });
    const target = {};
    decorator(target);

    expect((target as Containment).containmentMode).toEqual(true);
  });

  it('should decorate default containment attributes', () => {
    expect((DefaultType as any as Containment).containmentMode).toEqual(true);
  });

  it('should decorate empty containment attributes', () => {
    expect((EmptyType as any as Containment).containmentMode).toEqual(true);
  });

  it('should decorate global containment attributes', () => {
    expect((RegularType as any as Containment).containmentMode).toEqual(false);
  });

  it('should decorate parent containment attributes', () => {
    expect((ContainerType as any as Containment).containmentMode).toEqual(true);
  });
});
