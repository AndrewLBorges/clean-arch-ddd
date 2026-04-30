import Account from '../../domain/Account';
import DatabaseConnection from '../database/DatabaseConnection';

export default interface AccountRepository {
  saveAccount(account: Account): Promise<void>;
  getAccountById(accountId: string): Promise<Account>;
}

export class AccountRepositoryDatabase implements AccountRepository {
  constructor(readonly connection: DatabaseConnection) {}
  async saveAccount(account: Account) {
    await this.connection.query(
      'INSERT INTO ccca.account(account_id, name, email, document, password) VALUES($1, $2, $3, $4, $5)',
      [
        account.getAccountId(),
        account.getName(),
        account.getEmail(),
        account.getDocument(),
        account.getPassword(),
      ],
    );
  }

  async getAccountById(accountId: string): Promise<Account> {
    const [account] = await this.connection.query(
      'SELECT * FROM ccca.account WHERE account_id = $1',
      [accountId],
    );
    if (!account) throw new Error('Account not found');
    return new Account(
      account.account_id,
      account.name,
      account.email,
      account.document,
      account.password,
    );
  }
}

// Fake
export class AccountRepositoryMemory implements AccountRepository {
  accounts: Account[] = [];

  async saveAccount(account: Account): Promise<void> {
    this.accounts.push(account);
  }

  async getAccountById(accountId: string): Promise<Account> {
    const account = this.accounts.find(
      (account: Account) => account.getAccountId() === accountId,
    );
    if (!account) throw new Error('Account not found');
    return account;
  }
}
