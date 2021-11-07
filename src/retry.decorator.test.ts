import { Retry } from '.';

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

  describe('Given a class with a method to retry that is not asynchronous', () => {
    let testMock: jest.Mock<ArbitraryResult>;
    class TestClass {
      @Retry()
      test(arg1: ArbitraryArg): ArbitraryResult {
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
        testMock.mockReturnValue(arbitraryResult);
      });

      describe('When method is invoked with arbitrary arguments', () => {
        let result: ArbitraryResult;
        beforeEach(() => {
          result = testable.test(arbitraryArg);
        });

        test('Then result is successfully returned', () => {
          expect(result).toBe(arbitraryResult);
        });

        test('Then the original method is only called once with the original arguments', () => {
          assertMethodCalledCorrectly(1, arbitraryArg)
        });
      });
    });

    describe('Given decorated method will always fail', () => {
      beforeEach(() => {
        testMock.mockImplementation(() => {
          throw arbitraryError;
        });
      });

      describe('When method is invoked with arbitrary arguments', () => {
        let thrownError: unknown;
        beforeEach(() => {
          try {
            testable.test(arbitraryArg);
            fail('an error should have been thrown but was not');
          } catch (e) {
            thrownError = e;
          }
        });

        test('Then last error thrown by original method is thrown', () => {
          expect(thrownError).toBe(arbitraryError);
        });

        test('Then the original method is retried the default number of times', () => {
          assertMethodCalledCorrectly(3, arbitraryArg)
        });
      });
    });

    describe('Given decorated method will eventually succeed', () => {
      beforeEach(() => {
        testMock
          .mockImplementationOnce(() => {
            throw arbitraryError;
          })
          .mockReturnValue(arbitraryResult);
      });

      describe('When method is invoked with arbitrary arguments', () => {
        let result: ArbitraryResult;
        beforeEach(() => {
          result = testable.test(arbitraryArg);
        });

        test('Then result is successfully returned', () => {
          expect(result).toBe(arbitraryResult);
        });

        test('Then the original method is called the correct number of times', () => {
          assertMethodCalledCorrectly(2, arbitraryArg)
        });
      });
    });
  });
});
