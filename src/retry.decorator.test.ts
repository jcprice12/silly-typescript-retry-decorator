import { Retry } from './retry.decorator';

describe('Retry Decorator', () => {
  interface ArbitraryArg {
    foo: string;
  }
  interface ArbitraryResult {
    bar: string;
  }
  let arbitraryError: Error;
  let arbitraryArg: ArbitraryArg;
  let arbitraryResult: ArbitraryResult;
  beforeEach(() => {
    arbitraryError = new Error('errr');
    arbitraryArg = {
      foo: 'hello'
    };
    arbitraryResult = {
      bar: 'hi'
    };
  });

  describe('Given a class with a method to retry', () => {
    let testMock: jest.Mock<Promise<ArbitraryResult>>;
    class TestClass {
      @Retry()
      test(arg1: ArbitraryArg): Promise<ArbitraryResult> {
        return testMock(arg1);
      }
    }

    function assertMethodCalledCorrectly(
      times: number,
      arg: ArbitraryArg
    ): void {
      expect(testMock).toHaveBeenCalledTimes(times);
      for (let i = 0; i < times; i++) {
        expect(testMock).toHaveBeenNthCalledWith(i + 1, arg);
      }
    }

    let testable: TestClass;
    beforeEach(() => {
      testMock = jest.fn();
      testable = new TestClass();
    });

    describe('Given decorated method will not fail', () => {
      beforeEach(() => {
        testMock.mockResolvedValue(arbitraryResult);
      });

      describe('When method is invoked with arbitrary arguments', () => {
        let result: ArbitraryResult;
        beforeEach(async () => {
          result = await testable.test(arbitraryArg);
        });

        test('Then result is successfully returned', () => {
          expect(result).toBe(arbitraryResult);
        });

        test('Then the original method is only called once with the original arguments', () => {
          assertMethodCalledCorrectly(1, arbitraryArg);
        });
      });
    });

    describe('Given decorated method will always fail', () => {
      beforeEach(() => {
        testMock.mockRejectedValue(arbitraryError);
      });

      describe('When method is invoked with arbitrary arguments', () => {
        let thrownError: unknown;
        beforeEach(async () => {
          try {
            await testable.test(arbitraryArg);
            fail('an error should have been thrown but was not');
          } catch (e) {
            thrownError = e;
          }
        });

        test('Then last error thrown by original method is thrown', () => {
          expect(thrownError).toBe(arbitraryError);
        });

        test('Then the original method is retried the default number of times', () => {
          assertMethodCalledCorrectly(3, arbitraryArg);
        });
      });
    });

    describe('Given decorated method will eventually succeed', () => {
      beforeEach(() => {
        testMock
          .mockRejectedValueOnce(arbitraryError)
          .mockResolvedValue(arbitraryResult);
      });

      describe('When method is invoked with arbitrary arguments', () => {
        let result: ArbitraryResult;
        beforeEach(async () => {
          result = await testable.test(arbitraryArg);
        });

        test('Then result is successfully returned', () => {
          expect(result).toBe(arbitraryResult);
        });

        test('Then the original method is called the correct number of times', () => {
          assertMethodCalledCorrectly(2, arbitraryArg);
        });
      });
    });
  });
});
