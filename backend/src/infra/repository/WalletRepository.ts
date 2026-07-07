import Balance from '../../domain/Balance';
import Wallet from '../../domain/Wallet';
import DatabaseConnection from '../database/DatabaseConnection';
import { inject } from '../di/Registry';

export default interface WalletRepository {
  updateWallet(wallet: Wallet): Promise<void>;
  getWalletByAccountId(accountId: string): Promise<Wallet>;
}

export class WalletRepositoryDatabase implements WalletRepository {
  @inject('databaseConnection')
  connection!: DatabaseConnection;

  async updateWallet(wallet: Wallet): Promise<void> {
    await this.connection.query(
      'DELETE FROM ccca.balance WHERE account_id = $1',
      [wallet.getAccountId()],
    );

    for (const balance of wallet.balances) {
      await this.connection.query(
        'INSERT INTO ccca.balance(account_id, asset_id, quantity, blocked_quantity) VALUES($1, $2, $3, $4)',
        [
          wallet.getAccountId(),
          balance.assetId,
          balance.quantity,
          balance.blockedQuantity,
        ],
      );
    }
  }

  async getWalletByAccountId(accountId: string): Promise<Wallet> {
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
    return new Wallet(accountId, balances);
  }
}
