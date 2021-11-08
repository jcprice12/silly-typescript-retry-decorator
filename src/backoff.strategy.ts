export interface BackoffStrategy {
  getNextBackoffAmount(attemptsAlreadyMade: number): number;
}

export class FixedBackoffStrategy implements BackoffStrategy {
  constructor(private readonly timeToWaitBetweenAttempts: number) {}

  getNextBackoffAmount(): number {
    return this.timeToWaitBetweenAttempts;
  }
}
