import sinon from 'sinon';
import GetAccount from '../src/application/usecase/GetAccount';
import Signup from '../src/application/usecase/Signup';
import Account from '../src/domain/Account';
import DatabaseConnection, {
  PgPromiseAdapter,
} from '../src/infra/database/DatabaseConnection';
import * as mailer from '../src/infra/mailer/mailer';
import { AccountRepositoryDatabase } from '../src/infra/repository/AccountRepository';
import { WalletRepositoryDatabase } from '../src/infra/repository/WalletRepository';

let databaseConnection: DatabaseConnection;
let signup: Signup;
let getAccount: GetAccount;

beforeEach(() => {
  databaseConnection = new PgPromiseAdapter();
  const accountDAO = new AccountRepositoryDatabase(databaseConnection);
  signup = new Signup(accountDAO);
  const walletRepository = new WalletRepositoryDatabase(databaseConnection);
  getAccount = new GetAccount(accountDAO, walletRepository);
});

test('Deve criar uma conta', async () => {
  const input = {
    name: 'John Doe',
    email: 'john.doe@gmail.com',
    document: '97456321558',
    password: 'asdQWE123',
  };
  const outputSignup = await signup.execute(input);
  expect(outputSignup).toBeDefined();

  const outputGetAccount = await getAccount.execute(outputSignup.accountId);
  expect(outputGetAccount.accountId).toBe(outputSignup.accountId);
  expect(outputGetAccount.name).toBe(input.name);
  expect(outputGetAccount.email).toBe(input.email);
  expect(outputGetAccount.document).toBe(input.document);
  expect(outputGetAccount.password).toBe(input.password);
});

test('Deve criar uma conta com spy', async () => {
  const mailerSpy = sinon.spy(mailer, 'sendEmail');
  const input = {
    name: 'John Doe',
    email: 'john.doe@gmail.com',
    document: '97456321558',
    password: 'asdQWE123',
  };
  const outputSignup = await signup.execute(input);
  expect(outputSignup).toBeDefined();

  const outputGetAccount = await getAccount.execute(outputSignup.accountId);
  expect(outputGetAccount.accountId).toBe(outputSignup.accountId);
  expect(outputGetAccount.name).toBe(input.name);
  expect(outputGetAccount.email).toBe(input.email);
  expect(outputGetAccount.document).toBe(input.document);
  expect(outputGetAccount.password).toBe(input.password);
  expect(mailerSpy.calledOnce).toBe(true);
  expect(
    mailerSpy.calledWith(
      input.email,
      'Welcome!',
      'Your account has been created.',
    ),
  ).toBe(true);
  mailerSpy.restore();
});

test('Deve criar uma conta com stub', async () => {
  const mailerStub = sinon.stub(mailer, 'sendEmail').resolves();
  const accountRepositorySaveAccountStub = sinon
    .stub(AccountRepositoryDatabase.prototype, 'saveAccount')
    .resolves();
  const input = {
    name: 'John Doe',
    email: 'john.doe@gmail.com',
    document: '97456321558',
    password: 'asdQWE123',
  };

  const accountRepositoryGetAccountByIdStub = sinon
    .stub(AccountRepositoryDatabase.prototype, 'getAccountById')
    .resolves(
      Account.createAccount(
        input.name,
        input.email,
        input.document,
        input.password,
      ),
    );

  const outputSignup = await signup.execute(input);
  expect(outputSignup).toBeDefined();

  const outputGetAccount = await getAccount.execute(outputSignup.accountId);
  expect(outputGetAccount.name).toBe(input.name);
  expect(outputGetAccount.email).toBe(input.email);
  expect(outputGetAccount.document).toBe(input.document);
  expect(outputGetAccount.password).toBe(input.password);

  mailerStub.restore();
  accountRepositorySaveAccountStub.restore();
  accountRepositoryGetAccountByIdStub.restore();
});

test('Deve criar uma conta com mock', async () => {
  const mailerMock = sinon.mock(mailer);
  mailerMock
    .expects('sendEmail')
    .once()
    .withArgs(
      'john.doe@gmail.com',
      'Welcome!',
      'Your account has been created.',
    )
    .resolves();

  const input = {
    name: 'John Doe',
    email: 'john.doe@gmail.com',
    document: '97456321558',
    password: 'asdQWE123',
  };
  const outputSignup = await signup.execute(input);
  expect(outputSignup).toBeDefined();

  const outputGetAccount = await getAccount.execute(outputSignup.accountId);
  expect(outputGetAccount.accountId).toBe(outputSignup.accountId);
  expect(outputGetAccount.name).toBe(input.name);
  expect(outputGetAccount.email).toBe(input.email);
  expect(outputGetAccount.document).toBe(input.document);
  expect(outputGetAccount.password).toBe(input.password);
  mailerMock.verify();
  mailerMock.restore();
});

test('Não Deve criar uma conta se o nome for inválido', async () => {
  const input = {
    name: 'John',
    email: 'john.doe@gmail.com',
    document: '97456321558',
    password: 'asdQWE123',
  };
  await expect(() => signup.execute(input)).rejects.toThrow(
    new Error('Invalid name'),
  );
});

test('Não Deve criar uma conta se o email for inválido', async () => {
  const input = {
    name: 'John Does',
    email: 'john.doe@gmail',
    document: '97456321558',
    password: 'asdQWE123',
  };
  await expect(() => signup.execute(input)).rejects.toThrow(
    new Error('Invalid email'),
  );
});

test('Não Deve criar uma conta se o documento for inválido', async () => {
  const input = {
    name: 'John Does',
    email: 'john.doe@gmail.com',
    document: '974563215',
    password: 'asdQWE123',
  };
  await expect(() => signup.execute(input)).rejects.toThrow(
    new Error('Invalid document'),
  );
});

test.each(['asdQWEQQQQ', 'asdfasdfa1234', 'QWERQWEER123', 'asDF123', ''])(
  'Não Deve criar uma conta se a senha %s for inválida',
  async (senha: any) => {
    const input = {
      name: 'John Does',
      email: 'john.doe@gmail.com',
      document: '97456321558',
      password: senha,
    };
    await expect(() => signup.execute(input)).rejects.toThrow(
      new Error('Invalid password'),
    );
  },
);

afterEach(async () => {
  await databaseConnection.close();
});
