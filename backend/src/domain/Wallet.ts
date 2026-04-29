import Balance from './Balance';
import Order from './Order';
import UUID from './UUID';

export default class Wallet {
  private accountId: UUID;
  constructor(
    accountId: string,
    readonly balances: Balance[],
  ) {
    this.accountId = new UUID(accountId);
  }

  static createWallet() {
    const accountId = UUID.create().getValue();
    const balances: Balance[] = [];
    return new Wallet(accountId, balances);
  }

  deposit(assetId: string, quantity: number) {
    const existingBalance = this.balances.find(
      (balance: Balance) => balance.assetId === assetId,
    );
    if (existingBalance) {
      existingBalance.quantity += quantity;
    } else {
      this.balances.push(new Balance(assetId, quantity, 0));
    }
  }

  withdraw(assetId: string, quantity: number) {
    const existingBalance = this.balances.find(
      (balance: Balance) => balance.assetId === assetId,
    );
    if (!existingBalance) throw new Error('No funds on this asset');

    const newQuantity = existingBalance.quantity - quantity;
    if (newQuantity < 0) throw new Error('Insufficient funds');
    existingBalance.quantity = newQuantity;
  }

  getBalance(assetId: string): number {
    const existingBalance = this.balances.find(
      (balance: Balance) => balance.assetId === assetId,
    );
    if (!existingBalance) return 0;
    return existingBalance.getAvailableQuantity();
  }

  blockOrder(order: Order) {
    const assetId =
      order.getSide() === 'buy'
        ? order.getPaymentAsset()
        : order.getMainAsset();

    const quantity =
      order.getSide() === 'buy'
        ? order.getPrice() * order.getQuantity()
        : order.getQuantity();

    const balance = this.balances.find(
      (balance: Balance) => balance.assetId === assetId,
    );
    if (!balance) return false;
    if (balance.getAvailableQuantity() < quantity) return false;
    balance.blockedQuantity += quantity;

    return true;
  }

  getAccountId(): string {
    return this.accountId.getValue();
  }
}
