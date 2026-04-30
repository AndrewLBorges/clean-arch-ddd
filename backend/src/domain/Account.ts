import Document from './Document';
import Email from './Email';
import Name from './Name';
import Password from './Password';
import UUID from './UUID';

export default class Account {
  private name: Name;
  private email: Email;
  private document: Document;
  private password: Password;
  private accountId: UUID;
  constructor(
    accountId: string,
    name: string,
    email: string,
    document: string,
    password: string,
  ) {
    this.accountId = new UUID(accountId);
    this.name = new Name(name);
    this.email = new Email(email);
    this.document = new Document(document);
    this.password = new Password(password);
  }

  static createAccount(
    name: string,
    email: string,
    document: string,
    password: string,
  ) {
    const accountId = UUID.create().getValue();
    return new Account(accountId, name, email, document, password);
  }

  getName(): string {
    return this.name.getValue();
  }

  getEmail(): string {
    return this.email.getValue();
  }

  setEmail(email: string) {
    this.email = new Email(email);
  }

  getDocument(): string {
    return this.document.getValue();
  }

  getPassword(): string {
    return this.password.getValue();
  }

  getAccountId(): string {
    return this.accountId.getValue();
  }
}
