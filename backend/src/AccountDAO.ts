import pgp from 'pg-promise';

export default interface AccountDAO {
  saveAccount(account: any): Promise<void>;
  getAccountById(accountId: string): Promise<any>;
}

export class AccountDAODatabase implements AccountDAO {
  async saveAccount(account: any) {
    const connection = pgp()('postgres://postgres:123456@localhost:5432/app');
    await connection.query(
      'INSERT INTO ccca.account(account_id, name, email, document, password) VALUES($1, $2, $3, $4, $5)',
      [
        account.accountId,
        account.name,
        account.email,
        account.document,
        account.password,
      ],
    );
    await connection.$pool.end();
  }

  async getAccountById(accountId: string) {
    const connection = pgp()('postgres://postgres:123456@localhost:5432/app');
    const [account] = await connection.query(
      'SELECT * FROM ccca.account WHERE account_id = $1',
      [accountId],
    );
    await connection.$pool.end();
    return account;
  }
}
