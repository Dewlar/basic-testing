// Uncomment the code below and write your tests
import {
  BankAccount,
  getBankAccount,
  InsufficientFundsError,
  SynchronizationFailedError,
  TransferFailedError,
} from '.';
import lodash from 'lodash';

const INITIAL_BALANCE = 1011;

describe('BankAccount', () => {
  let account1: BankAccount;
  let account2: BankAccount;

  beforeEach(() => {
    account1 = getBankAccount(INITIAL_BALANCE);
    account2 = getBankAccount(INITIAL_BALANCE);
  });

  test('should create account with initial balance', () => {
    expect(account1).toBeInstanceOf(BankAccount);
    expect(account2.getBalance()).toBe(INITIAL_BALANCE);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    expect(() => account1.withdraw(INITIAL_BALANCE * 2)).toThrow(
      InsufficientFundsError,
    );
  });

  test('should throw error when transferring more than balance', () => {
    expect(() => account1.transfer(INITIAL_BALANCE * 2, account2)).toThrow(
      InsufficientFundsError,
    );
  });

  test('should throw error when transferring to the same account', () => {
    expect(() => account1.transfer(INITIAL_BALANCE * 2, account1)).toThrow(
      TransferFailedError,
    );
  });

  test('should deposit money', () => {
    const amountMoney = 117;
    account1.deposit(amountMoney);
    expect(account1.getBalance()).toBe(INITIAL_BALANCE + amountMoney);
  });

  test('should withdraw money', () => {
    const amountMoney = 117;
    account1.withdraw(amountMoney);
    expect(account1.getBalance()).toBe(INITIAL_BALANCE - amountMoney);
  });

  test('should transfer money', () => {
    const amountMoney = 117;
    account1.transfer(amountMoney, account2);
    expect(account1.getBalance()).toBe(INITIAL_BALANCE - amountMoney);
    expect(account2.getBalance()).toBe(INITIAL_BALANCE + amountMoney);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const randomValue = 111;
    jest
      .spyOn(lodash, 'random')
      .mockReturnValueOnce(randomValue)
      .mockReturnValueOnce(1);

    const balance = await account1.fetchBalance();

    expect(typeof balance).toBe('number');
    expect(balance).toBe(randomValue);
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const fetchBalance = 50;
    jest.spyOn(account1, 'fetchBalance').mockResolvedValueOnce(fetchBalance);

    expect(account1.getBalance()).toBe(INITIAL_BALANCE);
    await account1.synchronizeBalance();
    expect(account1.getBalance()).toBe(fetchBalance);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    jest.spyOn(account1, 'fetchBalance').mockResolvedValueOnce(null);

    await expect(account1.synchronizeBalance()).rejects.toThrow(
      SynchronizationFailedError,
    );
  });
});
