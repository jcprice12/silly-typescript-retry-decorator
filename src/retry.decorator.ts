export interface RetryDecoratorOptions {
  retryAttempts: number;
}

export function Retry(
  options: RetryDecoratorOptions = {
    retryAttempts: 2
  }
) {
  return function (
    _target: any,
    _propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    descriptor.value = new Proxy(descriptor.value, {
      apply: function (original, thisArg: any, args: any[]) {
        function retryable(attemptsLeft: number, lastError: unknown): unknown {
          if (attemptsLeft <= 0) {
            throw lastError;
          }
          try {
            return original.apply(thisArg, args);
          } catch (e) {
            return retryable(attemptsLeft - 1, e);
          }
        }
        return retryable(options.retryAttempts + 1, null);
      }
    });
  };
}
