import { of } from 'rxjs';

import { create } from './odata-result-set';
import { ODataSource } from './odata-source';

describe('ODataSource', () => {
  it('should create an instance', () => {
    expect(new ODataSource(query => of(create()))).toBeTruthy();
  });
});
