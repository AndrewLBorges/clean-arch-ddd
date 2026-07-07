import Deposit from '../src/application/usecase/Deposit';
import GetAccount from '../src/application/usecase/GetAccount';
import Signup from '../src/application/usecase/Signup';
import DatabaseConnection, {
  PgPromiseAdapter,
} from '../src/infra/database/DatabaseConnection';
import Registry from '../src/infra/di/Registry';
import { AccountRepositoryDatabase } from '../src/infra/repository/AccountRepository';
import { WalletRepositoryDatabase } from '../src/infra/repository/WalletRepository';

let databaseConnection: DatabaseConnection;
let signup: Signup;
let getAccount: GetAccount;
let deposit: Deposit;

beforeEach(() => {
  databaseConnection = new PgPromiseAdapter();
  Registry.getInstance().register('databaseConnection', databaseConnection);
  Registry.getInstance().register(
    'accountRepository',
    new AccountRepositoryDatabase(),
  );
  Registry.getInstance().register(
    'walletRepository',
    new WalletRepositoryDatabase(),
  );
  signup = new Signup();
  getAccount = new GetAccount();
  deposit = new Deposit();
});

test('Deve depositar em uma conta', async () => {
  const input = {
    name: 'John Doe',
    email: 'john.doe@gmail.com',
    document: '97456321558',
    password: 'asdQWE123',
  };
  const outputSignup = await signup.execute(input);
  expect(outputSignup).toBeDefined();

  const inputDeposit = {
    accountId: outputSignup.accountId,
    assetId: 'USD',
    quantity: 10000,
  };
  await deposit.execute(inputDeposit);
  const outputGetAccount = await getAccount.execute(outputSignup.accountId);
  expect(outputGetAccount.balances[0].assetId).toBe('USD');
  expect(outputGetAccount.balances[0].quantity).toBe(10000);
});

test('Deve depositar duas vezes em uma conta', async () => {
  const input = {
    name: 'John Doe',
    email: 'john.doe@gmail.com',
    document: '97456321558',
    password: 'asdQWE123',
  };
  const outputSignup = await signup.execute(input);
  expect(outputSignup).toBeDefined();

  const inputDeposit = {
    accountId: outputSignup.accountId,
    assetId: 'USD',
    quantity: 10000,
  };
  await deposit.execute(inputDeposit);
  await deposit.execute(inputDeposit);
  const outputGetAccount = await getAccount.execute(outputSignup.accountId);
  expect(outputGetAccount.balances[0].assetId).toBe('USD');
  expect(outputGetAccount.balances[0].quantity).toBe(20000);
});

test('Não deve depositar em uma conta que não existe', async () => {
  const inputDeposit = {
    accountId: crypto.randomUUID(),
    assetId: 'USD',
    quantity: 10000,
  };
  await expect(() => deposit.execute(inputDeposit)).rejects.toThrow(
    new Error('Account not found'),
  );
});

afterEach(async () => {
  await databaseConnection.close();
});
