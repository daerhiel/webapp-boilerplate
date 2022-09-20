import { convert, create } from "./odata-result-set";

import * as uuid from 'uuid';

export interface Data {
  index: number;
  text: string;
}

export const content: Data[] = [...Array(100).keys()].map(x => ({
  index: x,
  text: uuid.v4()
}));

describe('create', () => {
  it('should create default set', () => {
    const actual = create(content);

    expect(actual.offset).toEqual(0);
    expect(actual.count).toEqual(content.length);
    expect(actual.elements).toEqual(content);
  });

  it('should create undefined result set', () => {
    const [top, skip] = [undefined, undefined];
    const actual = create(content, top, skip);

    expect(actual.offset).toEqual(top ?? 0);
    expect(actual.count).toEqual(content.length);
    expect(actual.elements).toEqual(content);
  });

  it('should create skip result set', () => {
    const [top, skip] = [undefined, 10];
    const actual = create(content, top, skip);

    expect(actual.offset).toEqual(skip ?? 0);
    expect(actual.count).toEqual(content.length);
    expect(actual.elements).toEqual(content.slice(skip, top));
  });

  it('should create take top result set', () => {
    const [top, skip] = [30, undefined];
    const actual = create(content, top, skip);

    expect(actual.offset).toEqual(skip ?? 0);
    expect(actual.count).toEqual(content.length);
    expect(actual.elements).toEqual(content.slice(skip, top));
  });

  it('should create select result set', () => {
    const [top, skip] = [30, 10];
    const actual = create(content, top, skip);

    expect(actual.offset).toEqual(skip ?? 0);
    expect(actual.count).toEqual(content.length);
    expect(actual.elements).toEqual(content.slice(skip, top));
  });
});

describe('convert', () => {
  it('should convert default set', () => {
    const actual = convert(create(content), x => x.index!);

    expect(actual.offset).toEqual(0);
    expect(actual.count).toEqual(content.length);
    expect(actual.elements).toEqual(content.map(x => x.index));
  });

  it('should convert undefined result set', () => {
    const [top, skip] = [undefined, undefined];
    const actual = convert(create(content, top, skip), x => x.index!);

    expect(actual.offset).toEqual(top ?? 0);
    expect(actual.count).toEqual(content.length);
    expect(actual.elements).toEqual(content.map(x => x.index));
  });

  it('should convert result set', () => {
    const [top, skip] = [undefined, 10];
    const actual = convert(create(content, top, skip), x => x.index!);

    expect(actual.offset).toEqual(skip ?? 0);
    expect(actual.count).toEqual(content.length);
    expect(actual.elements).toEqual(content.slice(skip, top).map(x => x.index));
  });

  it('should convert take top result set', () => {
    const [top, skip] = [30, undefined];
    const actual = convert(create(content, top, skip), x => x.index!);

    expect(actual.offset).toEqual(skip ?? 0);
    expect(actual.count).toEqual(content.length);
    expect(actual.elements).toEqual(content.slice(skip, top).map(x => x.index));
  });

  it('should convert select result set', () => {
    const [top, skip] = [30, 10];
    const actual = convert(create(content, top, skip), x => x.index!);

    expect(actual.offset).toEqual(skip ?? 0);
    expect(actual.count).toEqual(content.length);
    expect(actual.elements).toEqual(content.slice(skip, top).map(x => x.index));
  });
});
