import UUID from './UUID';

export default class Order {
  private orderId: UUID;
  private marketId: string;
  private accountId: UUID;
  private side: string;
  private quantity: number;
  private price: number;
  private fillQuantity: number;
  private fillPrice: number;
  private status: string;
  private timestamp: Date;

  constructor(
    orderId: string,
    marketId: string,
    accountId: string,
    side: string,
    quantity: number,
    price: number,
    fillQuantity: number,
    fillPrice: number,
    status: string,
    timestamp: Date,
  ) {
    this.orderId = new UUID(orderId);
    this.marketId = marketId;
    this.accountId = new UUID(accountId);
    this.side = side;
    this.quantity = quantity;
    this.price = price;
    this.fillQuantity = fillQuantity;
    this.fillPrice = fillPrice;
    this.status = status;
    this.timestamp = timestamp;
  }

  static createOrder(
    accountId: string,
    marketId: string,
    side: string,
    quantity: number,
    price: number,
  ) {
    const orderId = UUID.create().getValue();
    return new Order(
      orderId,
      marketId,
      accountId,
      side,
      quantity,
      price,
      0,
      0,
      'open',
      new Date(),
    );
  }

  getOrderId(): string {
    return this.orderId.getValue();
  }

  getMarketId(): string {
    return this.marketId;
  }

  getAccountId(): string {
    return this.accountId.getValue();
  }

  getSide(): string {
    return this.side;
  }

  getQuantity(): number {
    return this.quantity;
  }

  getPrice(): number {
    return this.price;
  }

  getFillQuantity(): number {
    return this.fillQuantity;
  }

  getFillPrice(): number {
    return this.fillPrice;
  }

  getStatus(): string {
    return this.status;
  }

  getTimestamp(): Date {
    return this.timestamp;
  }

  getMainAsset(): string {
    const [mainAsset] = this.getMarketId().split('-');
    return mainAsset;
  }

  getPaymentAsset(): string {
    const [, paymentAsset] = this.getMarketId().split('-');
    return paymentAsset;
  }

  fill(fillQuantity: number, fillPrice: number) {
    this.fillQuantity += fillQuantity;
    this.fillPrice = fillPrice;

    if (this.getAvailableQuantity() === 0) this.status = 'closed';
  }

  getAvailableQuantity(): number {
    return this.quantity - this.fillQuantity;
  }
}
