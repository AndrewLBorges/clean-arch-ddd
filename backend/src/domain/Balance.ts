export default class Balance {
  constructor(
    readonly assetId: string,
    public quantity: number,
  ) {}

  getQuantity(): number {
    return this.quantity;
  }
}
