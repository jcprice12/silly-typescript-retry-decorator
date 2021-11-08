import { BackoffStrategy, FixedBackoffStrategy } from './backoff.strategy';

describe('Given fixed backoff strategy', () => {
  let backoffStrategy: BackoffStrategy;
  let timeToWait: number;
  beforeEach(() => {
    timeToWait = 100;
    backoffStrategy = new FixedBackoffStrategy(100);
  });

  describe('When getting next backoff amount', () => {
    let nextBackoffAmount: number;
    beforeEach(() => {
      nextBackoffAmount = backoffStrategy.getNextBackoffAmount(0);
    });

    test('Then the next backoff amount is returned', () => {
      expect(nextBackoffAmount).toBe(timeToWait);
    });
  });
});
