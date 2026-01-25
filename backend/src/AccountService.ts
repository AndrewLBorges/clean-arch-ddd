import AccountDAO from './AccountDAO';
import { sendEmail } from './mailer';
import { validateCpf } from './validateCpf';

export default class AccountService {
  accountDAO: AccountDAO;

  constructor(accountDAO: AccountDAO) {
    this.accountDAO = accountDAO;
  }

  async signup(input: any) {
    const accountId = crypto.randomUUID();
    const account = Object.assign({ accountId }, input);

    if (!account.name || !account.name.match(/^[a-zA-Z]+ [a-zA-Z]+$/)) {
      throw new Error('Invalid name');
    }

    if (!account.email || !account.email.match(/.+@.+\..+/)) {
      throw new Error('Invalid email');
    }

    if (!account.document || !validateCpf(account.document)) {
      throw new Error('Invalid document');
    }

    if (
      !account.password ||
      account.password.length < 8 ||
      !account.password.match(/[a-z]/) ||
      !account.password.match(/[A-Z]/) ||
      !account.password.match(/[0-9]/)
    ) {
      throw new Error('Invalid password');
    }

    await this.accountDAO.saveAccount(account);
    await sendEmail(
      account.email,
      'Welcome!',
      'Your account has been created.',
    );
    return { accountId };
  }

  async getAccount(accountId: string) {
    const account = await this.accountDAO.getAccountById(accountId);
    return account;
  }
}
