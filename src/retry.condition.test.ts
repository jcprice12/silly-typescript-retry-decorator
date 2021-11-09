import { AlwaysRetry } from './retry.condition';

describe('Given the retry condition is to always retry', () => {
  let retryCondition: AlwaysRetry;
  beforeEach(() => {
    retryCondition = new AlwaysRetry();
  });
  describe('When determining to retry', () => {
    let shouldRetry: boolean;
    beforeEach(() => {
      shouldRetry = retryCondition.shouldRetry();
    });
    test('Then the decision should be to retry', () => {
      expect(shouldRetry).toBe(true);
    });
  });
});
