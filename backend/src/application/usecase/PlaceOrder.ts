import Order from '../../domain/Order';
import { inject } from '../../infra/di/Registry';
import OrderRepository from '../../infra/repository/OrderRepository';
import WalletRepository from '../../infra/repository/WalletRepository';

export default class PlaceOrder {
  @inject('orderRepository')
  orderRepository!: OrderRepository;
  @inject('walletRepository')
  walletRepository!: WalletRepository;

  async execute(input: Input): Promise<Output> {
    const wallet = await this.walletRepository.getWalletByAccountId(
      input.accountId,
    );

    if (!wallet) throw new Error('Account not found');

    const order = Order.createOrder(
      input.accountId,
      input.marketId,
      input.side,
      input.quantity,
      input.price,
    );

    const hasBalance = wallet.blockOrder(order);

    if (!hasBalance) throw new Error('Insufficient funds');

    await this.orderRepository.saveOrder(order);
    await this.walletRepository.updateWallet(wallet);

    while (true) {
      const highestBuy = await this.orderRepository.getHighestBuy(
        input.marketId,
      );
      const lowestSell = await this.orderRepository.getLowestSell(
        input.marketId,
      );

      if (
        !highestBuy ||
        !lowestSell ||
        highestBuy.getPrice() < lowestSell.getPrice()
      ) {
        break;
      }

      const fillQuantity = Math.min(
        highestBuy.getQuantity(),
        lowestSell.getQuantity(),
      );
      const fillPrice =
        (highestBuy.getTimestamp() > lowestSell.getTimestamp()
          ? highestBuy
          : lowestSell
        ).getPrice() || 0;

      highestBuy.fill(fillQuantity, fillPrice);
      lowestSell.fill(fillQuantity, fillPrice);

      await this.orderRepository.updateOrder(highestBuy);
      await this.orderRepository.updateOrder(lowestSell);
    }
    return {
      orderId: order.getOrderId(),
    };
  }
}

type Input = {
  accountId: string;
  marketId: string;
  side: string;
  quantity: number;
  price: number;
};

type Output = {
  orderId: string;
};
