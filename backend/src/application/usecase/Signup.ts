import Account from '../../domain/Account';
import { sendEmail } from '../../infra/mailer/mailer';
import AccountRepository from '../../infra/repository/AccountRepository';

export default class Signup {
  constructor(readonly accountRepository: AccountRepository) {
    this.accountRepository = accountRepository;
  }

  async execute(input: Input): Promise<Output> {
    const account = Account.createAccount(
      input.name,
      input.email,
      input.document,
      input.password,
    );

    await this.accountRepository.saveAccount(account);
    await sendEmail(
      account.email,
      'Welcome!',
      'Your account has been created.',
    );
    return { accountId: account.accountId };
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
