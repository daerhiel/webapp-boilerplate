import { DeepPartial } from "./deep-partial";

/** Represents the OData entity result set containing the page and transition parameters. */
export interface ODataResultSet<T> {
  /** The current entity result set offset. */
  offset: number;

  /** The total number of entities in dataset. */
  count: number;

  /** The elements that entity result set contains. */
  elements: T[];

  /** The the url of a next entity result set sequence. */
  nextLink?: string;
}

export function create<T>(elements: T[], top?: number, skip: number = 0): ODataResultSet<T> {
  return {
    offset: skip,
    count: elements.length,
    elements: elements.slice(skip, top ?? elements.length)
  };
}

export function convert<T, U>(l: ODataResultSet<DeepPartial<T>>, callbackfn: (value: DeepPartial<T>, index: number, array: DeepPartial<T>[]) => U): ODataResultSet<U> {
  return {
    offset: l.offset,
    count: l.count,
    elements: l.elements.filter(x => x).map(callbackfn),
    nextLink: l.nextLink
  };
}
