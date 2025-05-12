// Uncomment the code below and write your tests
import axios from 'axios';
import { throttledGetDataFromApi } from './index';

jest.mock('axios');
jest.mock('lodash', () => ({
  throttle: (fn: () => unknown) => fn,
}));

describe('throttledGetDataFromApi', () => {
  const baseUrl = 'https://jsonplaceholder.typicode.com';
  const relativePath = '/posts/1';

  const mockedAxios = axios as jest.Mocked<typeof axios>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should create instance with provided base url', async () => {
    const getMock = jest.fn().mockResolvedValue({ data: 'mocked data' });

    mockedAxios.create = jest.fn(() => ({
      get: getMock,
    })) as never;

    await throttledGetDataFromApi(relativePath);

    expect(mockedAxios.create).toHaveBeenCalledWith({ baseURL: baseUrl });
  });

  test('should perform request to correct provided url', async () => {
    const getMock = jest.fn().mockResolvedValue({ data: 'mocked data' });

    mockedAxios.create = jest.fn(() => ({
      get: getMock,
    })) as never;

    await throttledGetDataFromApi(relativePath);

    expect(getMock).toHaveBeenCalledWith(relativePath);
  });

  test('should return response data', async () => {
    const mockData = { id: 1, title: 'post 1' };

    mockedAxios.create = jest.fn(() => ({
      get: jest.fn().mockResolvedValue({ data: mockData }),
    })) as never;

    await expect(throttledGetDataFromApi(relativePath)).resolves.toBe(mockData);
  });
});
