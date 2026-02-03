import GetAccount from './application/usecase/GetAccount';
import Signup from './application/usecase/Signup';
import AccountController from './infra/controller/AccountController';
import { PgPromiseAdapter } from './infra/database/DatabaseConnection';
import { ExpressAdapter } from './infra/http/HttpServer';
import { AccountRepositoryDatabase } from './infra/repository/AccountRepository';

async function main() {
  const httpServer = new ExpressAdapter();
  const connection = new PgPromiseAdapter();
  const accountRepository = new AccountRepositoryDatabase(connection);
  const signup = new Signup(accountRepository);
  const getAccount = new GetAccount(accountRepository);

  new AccountController(httpServer, signup, getAccount);
  httpServer.listen(3000);
}

main();
