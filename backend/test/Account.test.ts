import Account from '../src/domain/Account';

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
