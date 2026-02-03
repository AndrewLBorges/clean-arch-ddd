export default class Name {
  value: string;
  constructor(name: string) {
    if (!name || !name.match(/^[a-zA-Z]+ [a-zA-Z]+$/)) {
      throw new Error('Invalid name');
    }
    this.value = name;
  }
}
