import AccountDAO, { AccountDAODatabase } from '../src/AccountDAO';

test('Deve persistir uma account', async () => {
  const accountDAO = new AccountDAODatabase();
  const account = {
    accountId: crypto.randomUUID(),
    name: 'John Doe',
    email: 'john.doe@gmail.com',
    document: '97456321558',
    password: 'asdQWE123',
  };
  await accountDAO.saveAccount(account);
  const savedAccount = await accountDAO.getAccountById(account.accountId);
  expect(savedAccount.account_id).toBe(account.accountId);
  expect(savedAccount.name).toBe(account.name);
  expect(savedAccount.email).toBe(account.email);
  expect(savedAccount.document).toBe(account.document);
  expect(savedAccount.password).toBe(account.password);
});
