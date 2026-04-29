import Order from '../../domain/Order';
import DatabaseConnection from '../database/DatabaseConnection';

export default interface OrderRepository {
  saveOrder(order: Order): Promise<void>;
  getOrderById(orderId: string): Promise<Order>;
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
}

export class OrderRepositoryMemory implements OrderRepository {
  orders: Order[] = [];

  async saveOrder(order: Order): Promise<void> {
    this.orders.push(order);
  }

  async getOrderById(orderId: string): Promise<Order> {
    const order = this.orders.find(
      (order: Order) => order.getOrderId() === orderId,
    );
    if (!order) throw new Error('Order not found');
    return order;
  }
}
