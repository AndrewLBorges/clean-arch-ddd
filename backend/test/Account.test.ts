import Account from '../src/domain/Account';
import Order from '../src/domain/Order';

test('Deve fazer um depósito', () => {
  const account = Account.createAccount(
    'John Doe',
    'john.doe@gmail.com',
    '97456321558',
    'asdQWE123',
  );
  account.deposit('USD', 10000);
  expect(account.getBalance('USD')).toBe(10000);
});

test('Deve fazer dois depósitos', () => {
  const account = Account.createAccount(
    'John Doe',
    'john.doe@gmail.com',
    '97456321558',
    'asdQWE123',
  );
  account.deposit('USD', 10000);
  account.deposit('USD', 10000);
  expect(account.getBalance('USD')).toBe(20000);
});

test('Deve fazer um saque', () => {
  const account = Account.createAccount(
    'John Doe',
    'john.doe@gmail.com',
    '97456321558',
    'asdQWE123',
  );
  account.deposit('USD', 10000);
  account.deposit('USD', 10000);
  account.withdraw('USD', 10000);
  expect(account.getBalance('USD')).toBe(10000);
});

test('Não deve sacar sem fundos', () => {
  const account = Account.createAccount(
    'John Doe',
    'john.doe@gmail.com',
    '97456321558',
    'asdQWE123',
  );
  expect(() => account.withdraw('USD', 10000)).toThrow(
    new Error('No funds on this asset'),
  );
});

test('Deve validar o saldo da conta para a criação de uma ordem', () => {
  const account = Account.createAccount(
    'John Doe',
    'john.doe@gmail.com',
    '97456321558',
    'asdQWE123',
  );
  account.deposit('USD', 100000);
  const order = Order.createOrder(
    account.getAccountId(),
    'BTC-USD',
    'buy',
    1,
    78000,
  );
  const hasBalance = account.blockOrder(order);
  expect(hasBalance).toBe(true);
  expect(account.getBalance('USD')).toBe(22000);
});

test('Não deve ter saldo suficiente na conta para a criação de uma ordem', () => {
  const account = Account.createAccount(
    'John Doe',
    'john.doe@gmail.com',
    '97456321558',
    'asdQWE123',
  );
  account.deposit('USD', 10000);
  const order = Order.createOrder(
    account.getAccountId(),
    'BTC-USD',
    'buy',
    1,
    78000,
  );
  const hasBalance = account.blockOrder(order);
  expect(hasBalance).toBe(false);
  expect(account.getBalance('USD')).toBe(10000);
});

test('Não deve ter saldo suficiente na conta para a criação de duas ordens', () => {
  const account = Account.createAccount(
    'John Doe',
    'john.doe@gmail.com',
    '97456321558',
    'asdQWE123',
  );
  account.deposit('USD', 100000);
  const order1 = Order.createOrder(
    account.getAccountId(),
    'BTC-USD',
    'buy',
    1,
    78000,
  );
  const hasBalance1 = account.blockOrder(order1);
  expect(hasBalance1).toBe(true);
  expect(account.getBalance('USD')).toBe(22000);

  const order2 = Order.createOrder(
    account.getAccountId(),
    'BTC-USD',
    'buy',
    1,
    78000,
  );
  const hasBalance2 = account.blockOrder(order2);
  expect(hasBalance2).toBe(false);
  expect(account.getBalance('USD')).toBe(22000);
});
