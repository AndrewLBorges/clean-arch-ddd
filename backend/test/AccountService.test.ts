import { AccountDAODatabase } from '../src/AccountDAO';
import AccountService from '../src/AccountService';
import sinon from 'sinon';
import * as mailer from '../src/mailer';

let accountService: AccountService;

beforeEach(() => {
  const accountDAO = new AccountDAODatabase();
  accountService = new AccountService(accountDAO);
});

test('Deve criar uma conta', async () => {
  const input = {
    name: 'John Doe',
    email: 'john.doe@gmail.com',
    document: '97456321558',
    password: 'asdQWE123',
  };
  const outputSignup = await accountService.signup(input);
  expect(outputSignup).toBeDefined();

  const outputGetAccount = await accountService.getAccount(
    outputSignup.accountId,
  );
  expect(outputGetAccount.account_id).toBe(outputSignup.accountId);
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
  const outputSignup = await accountService.signup(input);
  expect(outputSignup).toBeDefined();

  const outputGetAccount = await accountService.getAccount(
    outputSignup.accountId,
  );
  expect(outputGetAccount.account_id).toBe(outputSignup.accountId);
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
  const input = {
    name: 'John Doe',
    email: 'john.doe@gmail.com',
    document: '97456321558',
    password: 'asdQWE123',
  };
  const outputSignup = await accountService.signup(input);
  expect(outputSignup).toBeDefined();

  const outputGetAccount = await accountService.getAccount(
    outputSignup.accountId,
  );
  expect(outputGetAccount.account_id).toBe(outputSignup.accountId);
  expect(outputGetAccount.name).toBe(input.name);
  expect(outputGetAccount.email).toBe(input.email);
  expect(outputGetAccount.document).toBe(input.document);
  expect(outputGetAccount.password).toBe(input.password);

  mailerStub.restore();
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
  const outputSignup = await accountService.signup(input);
  expect(outputSignup).toBeDefined();

  const outputGetAccount = await accountService.getAccount(
    outputSignup.accountId,
  );
  expect(outputGetAccount.account_id).toBe(outputSignup.accountId);
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
  await expect(() => accountService.signup(input)).rejects.toThrow(
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
  await expect(() => accountService.signup(input)).rejects.toThrow(
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
  await expect(() => accountService.signup(input)).rejects.toThrow(
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
    await expect(() => accountService.signup(input)).rejects.toThrow(
      new Error('Invalid password'),
    );
  },
);
