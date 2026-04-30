import Order from '../../domain/Order';
import DatabaseConnection from '../database/DatabaseConnection';

export default interface OrderRepository {
  saveOrder(order: Order): Promise<void>;
  updateOrder(order: Order): Promise<void>;
  getOrderById(orderId: string): Promise<Order>;
  getHighestBuy(marketId: string): Promise<Order | undefined>;
  getLowestSell(marketId: string): Promise<Order | undefined>;
}

export class OrderRepositoryDatabase implements OrderRepository {
  constructor(readonly connection: DatabaseConnection) {}

  async saveOrder(order: Order): Promise<void> {
    await this.connection.query(
      'INSERT INTO ccca.order(order_id, market_id, account_id, side, quantity, price, fill_quantity, fill_price, status, timestamp) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
      [
        order.getOrderId(),
        order.getMarketId(),
        order.getAccountId(),
        order.getSide(),
        order.getQuantity(),
        order.getPrice(),
        order.getFillQuantity(),
        order.getFillPrice(),
        order.getStatus(),
        order.getTimestamp(),
      ],
    );
  }

  async updateOrder(order: Order): Promise<void> {
    await this.connection.query(
      'UPDATE ccca.order SET fill_quantity = $1, fill_price = $2, status = $3 WHERE order_id = $4',
      [
        order.getFillQuantity(),
        order.getFillPrice(),
        order.getStatus(),
        order.getOrderId(),
      ],
    );
  }

  async getOrderById(orderId: string): Promise<Order> {
    const [orderData] = await this.connection.query(
      'SELECT * FROM ccca.order WHERE order_id = $1',
      [orderId],
    );
    if (!orderData) throw new Error('Order not found');
    return new Order(
      orderData.order_id,
      orderData.market_id,
      orderData.account_id,
      orderData.side,
      parseFloat(orderData.quantity),
      parseFloat(orderData.price),
      parseFloat(orderData.fill_quantity),
      parseFloat(orderData.fill_price),
      orderData.status,
      new Date(orderData.timestamp),
    );
  }

  async getHighestBuy(marketId: string): Promise<Order | undefined> {
    const [orderData] = await this.connection.query(
      'SELECT * FROM ccca.order WHERE market_id = $1 AND side = $2 AND status = $3 ORDER BY price DESC, timestamp ASC LIMIT 1',
      [marketId, 'buy', 'open'],
    );
    if (!orderData) return undefined;
    return new Order(
      orderData.order_id,
      orderData.market_id,
      orderData.account_id,
      orderData.side,
      parseFloat(orderData.quantity),
      parseFloat(orderData.price),
      parseFloat(orderData.fill_quantity),
      parseFloat(orderData.fill_price),
      orderData.status,
      new Date(orderData.timestamp),
    );
  }

  async getLowestSell(marketId: string): Promise<Order | undefined> {
    const [orderData] = await this.connection.query(
      'SELECT * FROM ccca.order WHERE market_id = $1 AND side = $2 AND status = $3 ORDER BY price ASC, timestamp ASC LIMIT 1',
      [marketId, 'sell', 'open'],
    );
    if (!orderData) return undefined;
    return new Order(
      orderData.order_id,
      orderData.market_id,
      orderData.account_id,
      orderData.side,
      parseFloat(orderData.quantity),
      parseFloat(orderData.price),
      parseFloat(orderData.fill_quantity),
      parseFloat(orderData.fill_price),
      orderData.status,
      new Date(orderData.timestamp),
    );
  }
}
