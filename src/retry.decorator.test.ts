import { hello } from '.';

describe('When foo', () => {
  let consoleLogSpy: jest.SpyInstance;
  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    hello('world');
  });
  test('Then bar', () => {
    expect(consoleLogSpy).toHaveBeenCalledWith('world');
  });
});
