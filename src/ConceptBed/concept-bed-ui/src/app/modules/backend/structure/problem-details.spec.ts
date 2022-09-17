import { getEqualityTester } from '@app/spec/helpers';
import { failure } from '@modules/backend/content-api.service.spec';
import { DeepPartial } from './deep-partial';
import { ProblemDetails } from './problem-details';
import { ProblemDetailsApi } from './problem-details-api';

describe('ProblemDetails', () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(getEqualityTester(ProblemDetails));
  });

  it('should create an instance', () => {
    const actual = new ProblemDetails();

    expect(actual).toEqual({} as any);
  });

  it('should create an empty instance', () => {
    const actual = new ProblemDetails({});

    expect(actual).toEqual({} as any);
  });

  it('should create an instance', () => {
    const actual = new ProblemDetails(failure);

    expect(actual).toEqual(failure as any);
  });

  it('should update an instance', () => {
    const actual = new ProblemDetails(failure);
    const update: DeepPartial<ProblemDetailsApi> = {
      title: "An internal error occurred while processing your request.",
      status: 500,
    };

    actual.update(update);

    expect(actual).toEqual(Object.assign(failure, update) as any);
  });
});
