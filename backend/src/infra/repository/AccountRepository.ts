import Account from '../../domain/Account';
import Balance from '../../domain/Balance';
import DatabaseConnection from '../database/DatabaseConnection';

export default interface AccountRepository {
  saveAccount(account: Account): Promise<void>;
  updateAccount(account: Account): Promise<void>;
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

  async updateAccount(account: Account): Promise<void> {
    await this.connection.query(
      'DELETE FROM ccca.balance WHERE account_id = $1',
      [account.getAccountId()],
    );

    for (const balance of account.balances) {
      await this.connection.query(
        'INSERT INTO ccca.balance(account_id, asset_id, quantity, blocked_quantity) VALUES($1, $2, $3, $4)',
        [
          account.getAccountId(),
          balance.assetId,
          balance.quantity,
          balance.blockedQuantity,
        ],
      );
    }
  }

  async getAccountById(accountId: string): Promise<Account> {
    const [account] = await this.connection.query(
      'SELECT * FROM ccca.account WHERE account_id = $1',
      [accountId],
    );

    const balancesData = await this.connection.query(
      'SELECT * FROM ccca.balance WHERE account_id = $1',
      [accountId],
    );
    const balances = balancesData.map(
      (balancesData: any) =>
        new Balance(
          balancesData.asset_id,
          parseFloat(balancesData.quantity),
          parseFloat(balancesData.blocked_quantity),
        ),
    );
    if (!account) throw new Error('Account not found');
    return new Account(
      account.account_id,
      account.name,
      account.email,
      account.document,
      account.password,
      balances,
    );
  }
}

// Fake
export class AccountRepositoryMemory implements AccountRepository {
  accounts: Account[] = [];

  async saveAccount(account: Account): Promise<void> {
    this.accounts.push(account);
  }

  async updateAccount(account: Account): Promise<void> {
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
