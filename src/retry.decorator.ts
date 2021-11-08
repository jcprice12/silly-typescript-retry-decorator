import { BackoffStrategy, FixedBackoffStrategy } from './backoff.strategy';

export interface RetryDecoratorOptions {
  retryAttempts?: number;
  backoffStrategy?: BackoffStrategy;
}

export function Retry(options: RetryDecoratorOptions = {}) {
  const finalOpts: Required<RetryDecoratorOptions> = finalizeOptions(options);
  return function (
    _target: any,
    _propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    descriptor.value = new Proxy(descriptor.value, {
      apply: function (original, thisArg: any, args: any[]) {
        async function retryable(
          attemptsLeft: number,
          attemptsMade: number,
          lastError: unknown
        ): Promise<unknown> {
          if (attemptsLeft <= 0) {
            throw lastError;
          }
          if (attemptsMade > 0) {
            await sleep(
              finalOpts.backoffStrategy.getNextBackoffAmount(attemptsMade)
            );
          }
          try {
            return await original.apply(thisArg, args);
          } catch (e) {
            return retryable(attemptsLeft - 1, attemptsMade + 1, e);
          }
        }
        return retryable(finalOpts.retryAttempts + 1, 0, null);
      }
    });
  };
}

function sleep(timeToWait: number): Promise<number> {
  return new Promise((r) => setTimeout(r, timeToWait));
}

function finalizeOptions(
  opts: RetryDecoratorOptions
): Required<RetryDecoratorOptions> {
  return {
    retryAttempts: opts.retryAttempts ?? 2,
    backoffStrategy: opts.backoffStrategy ?? new FixedBackoffStrategy(0)
  };
}
