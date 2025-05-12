// Uncomment the code below and write your tests
import path from 'node:path';
import fs from 'node:fs';
import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';

const DELAY = 1000;
const INTERVAL = 500;
const callback = jest.fn();

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    jest.spyOn(global, 'setTimeout');
    doStuffByTimeout(callback, DELAY);

    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenCalledWith(callback, DELAY);
  });

  test('should call callback only after timeout', () => {
    doStuffByTimeout(callback, DELAY);
    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(DELAY);

    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    jest.spyOn(global, 'setInterval');
    doStuffByInterval(callback, INTERVAL);

    expect(setInterval).toHaveBeenCalledWith(callback, INTERVAL);
  });

  test('should call callback multiple times after multiple intervals', () => {
    const callCount = 3;

    doStuffByInterval(callback, DELAY);
    jest.advanceTimersByTime(DELAY * callCount); // should call 3 times

    expect(callback).toHaveBeenCalledTimes(callCount);
  });
});

describe('readFileAsynchronously', () => {
  const MOCK_FILE_PATH = 'path/to/file.txt';

  test('should call join with pathToFile', async () => {
    const joinSpy = jest.spyOn(path, 'join');

    await readFileAsynchronously(MOCK_FILE_PATH);

    expect(joinSpy).toHaveBeenCalledTimes(1);
    expect(joinSpy).toHaveBeenCalledWith(__dirname, MOCK_FILE_PATH);
  });

  test('should return null if file does not exist', async () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(false);

    await expect(readFileAsynchronously(MOCK_FILE_PATH)).resolves.toBeNull();
  });

  test('should return file content if file exists', async () => {
    const content = 'hello world!';
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(fs.promises, 'readFile').mockResolvedValue(content);

    const result = await readFileAsynchronously(MOCK_FILE_PATH);

    expect(result).toBe(content);
  });
});
