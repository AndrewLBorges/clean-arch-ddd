export default class Password {
  private value: string;
  constructor(password: string) {
    if (
      !password ||
      password.length < 8 ||
      !password.match(/[a-z]/) ||
      !password.match(/[A-Z]/) ||
      !password.match(/[0-9]/)
    ) {
      throw new Error('Invalid password');
    }
    this.value = password;
  }

  getValue() {
    return this.value;
  }
}
