import { inject } from '../../infra/di/Registry';
import OrderRepository from '../../infra/repository/OrderRepository';

export default class GetOrder {
  @inject('orderRepository')
  orderRepository!: OrderRepository;
  async execute(orderId: string): Promise<Output> {
    const order = await this.orderRepository.getOrderById(orderId);
    return {
      orderId: order.getOrderId(),
      marketId: order.getMarketId(),
      accountId: order.getAccountId(),
      side: order.getSide(),
      quantity: order.getQuantity(),
      price: order.getPrice(),
      fillQuantity: order.getFillQuantity(),
      fillPrice: order.getFillPrice(),
      status: order.getStatus(),
      timestamp: order.getTimestamp(),
    };
  }
}

type Output = {
  orderId: string;
  marketId: string;
  accountId: string;
  side: string;
  quantity: number;
  price: number;
  fillQuantity: number;
  fillPrice: number;
  status: string;
  timestamp: Date;
};
