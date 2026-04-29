export default class UUID {
  private value: string;

  constructor(uuid: string) {
    if (
      !uuid ||
      !uuid.match(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      )
    ) {
      throw new Error('Invalid uuid');
    }
    this.value = uuid;
  }

  static create() {
    return new UUID(crypto.randomUUID());
  }

  getValue(): string {
    return this.value;
  }
}
