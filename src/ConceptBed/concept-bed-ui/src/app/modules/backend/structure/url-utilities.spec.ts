import * as uuid from 'uuid';

import { buildUrl } from './url-utilities';

export const baseUrl = 'https://localhost';

describe('buildUrl', () => {
  it('should build controller / operation url', () => {
    const actual = buildUrl(baseUrl, 'controller');

    expect(actual).toEqual(`${baseUrl}/controller`);
  });

  it('should build controller / operation url', () => {
    const actual = buildUrl(baseUrl, 'controller', ['handle']);
    expect(actual).toEqual(`${baseUrl}/controller/handle`);
  });

  it('should build controller / operation / id url', () => {
    const id = uuid.v4();
    const actual = buildUrl(baseUrl, 'controller', ['handle', id]);

    expect(actual).toEqual(`${baseUrl}/controller/handle/${id}`);
  });

  it('should build controller single empty query url', () => {
    const actual = buildUrl(baseUrl, 'controller', [], { });

    expect(actual).toEqual(`${baseUrl}/controller`);
  });

  it('should build controller single string query url', () => {
    const name: string = 'query', value: string = 'value';
    const actual = buildUrl(baseUrl, 'controller', [], { [name]: value });

    expect(actual).toEqual(`${baseUrl}/controller?${name}=${encodeURIComponent(value)}`);
  });

  it('should build controller single number query url', () => {
    const name: string = 'query', value: number = 10;
    const actual = buildUrl(baseUrl, 'controller', [], { [name]: value });

    expect(actual).toEqual(`${baseUrl}/controller?${name}=${encodeURIComponent(value)}`);
  });

  it('should build controller single number query url', () => {
    const name: string = 'query', value: Date = new Date();
    const actual = buildUrl(baseUrl, 'controller', [], { [name]: value });

    expect(actual).toEqual(`${baseUrl}/controller?${name}=${encodeURIComponent(value.toISOString())}`);
  });
});
