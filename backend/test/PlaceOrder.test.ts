import Deposit from '../src/application/usecase/Deposit';
import GetAccount from '../src/application/usecase/GetAccount';
import GetOrder from '../src/application/usecase/GetOrder';
import PlaceOrder from '../src/application/usecase/PlaceOrder';
import Signup from '../src/application/usecase/Signup';
import DatabaseConnection, {
  PgPromiseAdapter,
} from '../src/infra/database/DatabaseConnection';
import { AccountRepositoryDatabase } from '../src/infra/repository/AccountRepository';
import { OrderRepositoryDatabase } from '../src/infra/repository/OrderRepository';
import { WalletRepositoryDatabase } from '../src/infra/repository/WalletRepository';

let databaseConnection: DatabaseConnection;
let signup: Signup;
let getAccount: GetAccount;
let deposit: Deposit;
let placeOrder: PlaceOrder;
let getOrder: GetOrder;

beforeEach(() => {
  databaseConnection = new PgPromiseAdapter();
  const accountRepository = new AccountRepositoryDatabase(databaseConnection);
  const orderRepository = new OrderRepositoryDatabase(databaseConnection);
  const walletRepository = new WalletRepositoryDatabase(databaseConnection);
  signup = new Signup(accountRepository);
  getAccount = new GetAccount(accountRepository, walletRepository);
  deposit = new Deposit(accountRepository, walletRepository);
  placeOrder = new PlaceOrder(orderRepository, walletRepository);
  getOrder = new GetOrder(orderRepository);
});

test('Deve criar uma ordem de compra em uma conta', async () => {
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
    quantity: 100000,
  };
  await deposit.execute(inputDeposit);

  const inputOrder = {
    accountId: outputSignup.accountId,
    marketId: 'BTC-USD',
    side: 'buy',
    quantity: 1,
    price: 78000,
  };

  const outputPlaceOrder = await placeOrder.execute(inputOrder);
  expect(outputPlaceOrder.orderId).toBeDefined();
  const outputGetOrder = await getOrder.execute(outputPlaceOrder.orderId);
  expect(outputGetOrder.quantity).toBe(1);
  expect(outputGetOrder.price).toBe(78000);
});

test('Não deve criar mais uma ordem de compra em uma conta do que existe saldo', async () => {
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
    quantity: 100000,
  };
  await deposit.execute(inputDeposit);

  const inputOrder1 = {
    accountId: outputSignup.accountId,
    marketId: 'BTC-USD',
    side: 'buy',
    quantity: 1,
    price: 78000,
  };

  const outputPlaceOrder1 = await placeOrder.execute(inputOrder1);
  expect(outputPlaceOrder1.orderId).toBeDefined();

  const inputOrder2 = {
    accountId: outputSignup.accountId,
    marketId: 'BTC-USD',
    side: 'buy',
    quantity: 1,
    price: 78000,
  };

  expect(() => placeOrder.execute(inputOrder2)).rejects.toThrow(
    new Error('Insufficient funds'),
  );
});

test('Não deve criar uma ordem de compra em uma conta se não tiver saldo', async () => {
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

  const inputOrder = {
    accountId: outputSignup.accountId,
    marketId: 'BTC-USD',
    side: 'buy',
    quantity: 1,
    price: 78000,
  };

  await expect(() => placeOrder.execute(inputOrder)).rejects.toThrow(
    new Error('Insufficient funds'),
  );
});

afterEach(async () => {
  await databaseConnection.close();
});
