import Balance from './Balance';
import Name from './Name';
import { validateCpf } from './validateCpf';

export default class Account {
  name: Name;
  constructor(
    readonly accountId: string,
    name: string,
    readonly email: string,
    readonly document: string,
    readonly password: string,
    readonly balances: Balance[],
  ) {
    this.name = new Name(name);
    if (!email || !email.match(/.+@.+\..+/)) {
      throw new Error('Invalid email');
    }

    if (!document || !validateCpf(document)) {
      throw new Error('Invalid document');
    }

    if (
      !password ||
      password.length < 8 ||
      !password.match(/[a-z]/) ||
      !password.match(/[A-Z]/) ||
      !password.match(/[0-9]/)
    ) {
      throw new Error('Invalid password');
    }
  }

  static createAccount(
    name: string,
    email: string,
    document: string,
    password: string,
  ) {
    const accountId = crypto.randomUUID();
    const balances: Balance[] = [];
    return new Account(accountId, name, email, document, password, balances);
  }

  deposit(assetId: string, quantity: number) {
    const existingBalance = this.balances.find(
      (balance: Balance) => balance.assetId === assetId,
    );
    if (existingBalance) {
      existingBalance.quantity += quantity;
    } else {
      this.balances.push(new Balance(assetId, quantity));
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
    return existingBalance ? existingBalance.quantity : 0;
  }

  getName(): string {
    return this.name.value;
  }
}
