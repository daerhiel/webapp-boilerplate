import { HttpErrorResponse } from '@angular/common/http';

import { getEqualityTester } from '@app/spec/helpers';
import { failure } from '@modules/backend/content-api.service.spec';
import { DeepPartial } from './deep-partial';
import { ProblemDetailsApi } from './problem-details-api';
import { isResult, isSuccess, problemDetails, ProblemDetails } from './problem-details';

describe('ProblemDetails', () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(getEqualityTester(ProblemDetails));
  });

  it('should create', () => {
    const actual = new ProblemDetails();

    expect(actual).toEqual({} as any);
  });

  it('should create from empty object', () => {
    const actual = new ProblemDetails({});

    expect(actual).toEqual({} as any);
  });

  it('should create from object', () => {
    const actual = new ProblemDetails(failure);

    expect(actual).toEqual(failure as any);
  });

  it('should update', () => {
    const actual = new ProblemDetails(failure);
    const update: DeepPartial<ProblemDetailsApi> = {
      title: "An internal error occurred while processing your request.",
      status: 500,
    };

    actual.update(update);

    expect(actual).toEqual(Object.assign(failure, update) as any);
  });
});

describe('isResult', () => {
  it('should not detect valid object', () => {
    expect(isResult({})).toBeTrue();
  });

  it('should not detect problem details', () => {
    expect(isResult(new ProblemDetails())).toBeFalse();
  });
});

describe('isSuccess', () => {
  it('should detect valid object', () => {
    expect(isSuccess({})).toBeTrue();
  });

  it('should not detect http error response', () => {
    expect(isSuccess(new HttpErrorResponse({}))).toBeFalse();
  });
});

describe('problemDetails', () => {
  it('should detect valid object', () => {
    const title = 'Error occurred';
    expect(problemDetails(title)).toEqual(new ProblemDetails({
      type: 'internal', title, status: 100
    }));
  });
});
