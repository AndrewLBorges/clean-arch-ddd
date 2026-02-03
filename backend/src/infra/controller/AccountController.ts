import GetAccount from '../../application/usecase/GetAccount';
import Signup from '../../application/usecase/Signup';
import HttpServer from '../http/HttpServer';

export default class AccountController {
  constructor(httpServer: HttpServer, signup: Signup, getAccount: GetAccount) {
    httpServer.route('post', '/signup', async (params: any, body: any) => {
      const output = await signup.execute(body);
      return output;
    });

    httpServer.route(
      'get',
      '/accounts/:accountId',
      async (params: any, body: any) => {
        const output = await getAccount.execute(params.accountId);
        return output;
      },
    );
  }
}
