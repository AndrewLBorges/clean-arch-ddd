import GetAccount from './application/usecase/GetAccount';
import Signup from './application/usecase/Signup';
import AccountController from './infra/controller/AccountController';
import { PgPromiseAdapter } from './infra/database/DatabaseConnection';
import { ExpressAdapter } from './infra/http/HttpServer';
import { AccountRepositoryDatabase } from './infra/repository/AccountRepository';
import { WalletRepositoryDatabase } from './infra/repository/WalletRepository';

async function main() {
  const httpServer = new ExpressAdapter();
  const connection = new PgPromiseAdapter();
  const accountRepository = new AccountRepositoryDatabase(connection);
  const signup = new Signup(accountRepository);
  const walletRepository = new WalletRepositoryDatabase(connection);
  const getAccount = new GetAccount(accountRepository, walletRepository);

  new AccountController(httpServer, signup, getAccount);
  httpServer.listen(3000);
}

main();
