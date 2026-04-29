import Order from '../../domain/Order';
import AccountRepository from '../../infra/repository/AccountRepository';
import OrderRepository from '../../infra/repository/OrderRepository';

export default class PlaceOrder {
  constructor(
    readonly accountRepository: AccountRepository,
    readonly orderRepository: OrderRepository,
  ) {
    this.accountRepository = accountRepository;
  }

  async execute(input: Input): Promise<Output> {
    const account = await this.accountRepository.getAccountById(
      input.accountId,
    );
    if (!account) throw new Error('Account not found');

    const order = Order.createOrder(
      input.accountId,
      input.marketId,
      input.side,
      input.quantity,
      input.price,
    );

    const hasBalance = account.blockOrder(order);

    if (!hasBalance) throw new Error('Insufficient funds');

    await this.orderRepository.saveOrder(order);
    await this.accountRepository.updateAccount(account);
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
