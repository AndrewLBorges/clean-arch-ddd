import GetAccount from './application/usecase/GetAccount';
import Signup from './application/usecase/Signup';
import AccountController from './infra/controller/AccountController';
import { PgPromiseAdapter } from './infra/database/DatabaseConnection';
import Registry from './infra/di/Registry';
import { ExpressAdapter } from './infra/http/HttpServer';
import { AccountRepositoryDatabase } from './infra/repository/AccountRepository';
import { WalletRepositoryDatabase } from './infra/repository/WalletRepository';

async function main() {
  const httpServer = new ExpressAdapter();
  Registry.getInstance().register('httpServer', httpServer);
  Registry.getInstance().register('databaseConnection', new PgPromiseAdapter());
  Registry.getInstance().register(
    'accountRepository',
    new AccountRepositoryDatabase(),
  );
  Registry.getInstance().register(
    'walletRepository',
    new WalletRepositoryDatabase(),
  );
  Registry.getInstance().register('signup', new Signup());
  Registry.getInstance().register('getAccount', new GetAccount());
  new AccountController();
  httpServer.listen(3000);
}

main();
