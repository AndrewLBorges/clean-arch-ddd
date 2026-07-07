import Account from '../../domain/Account';
import { inject } from '../../infra/di/Registry';
import { sendEmail } from '../../infra/mailer/mailer';
import AccountRepository from '../../infra/repository/AccountRepository';

export default class Signup {
  @inject('accountRepository')
  accountRepository!: AccountRepository;

  async execute(input: Input): Promise<Output> {
    const account = Account.createAccount(
      input.name,
      input.email,
      input.document,
      input.password,
    );

    await this.accountRepository.saveAccount(account);
    await sendEmail(
      account.getEmail(),
      'Welcome!',
      'Your account has been created.',
    );
    return { accountId: account.getAccountId() };
  }
}

type Input = {
  name: string;
  email: string;
  document: string;
  password: string;
};

type Output = {
  accountId: string;
};
