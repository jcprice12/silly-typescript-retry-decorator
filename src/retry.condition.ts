export interface RetryCondition<E> {
  shouldRetry(error: E): boolean;
}

export class AlwaysRetry implements RetryCondition<unknown> {
  shouldRetry(): boolean {
    return true;
  }
}
