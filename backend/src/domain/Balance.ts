export default class Balance {
  constructor(
    readonly assetId: string,
    public quantity: number,
    public blockedQuantity: number,
  ) {}

  getQuantity(): number {
    return this.quantity;
  }

  getAvailableQuantity(): number {
    return this.quantity - this.blockedQuantity;
  }
}
