export default class Document {
  private static readonly VALID_LENGTH = 11;
  private value: string;
  constructor(document: string) {
    if (!document || !Document.validate(document)) {
      throw new Error('Invalid document');
    }
    this.value = document;
  }

  getValue() {
    return this.value;
  }

  static validate(cpf: string) {
    if (!cpf) return false;
    cpf = Document.extractOnlyNumbers(cpf);
    if (cpf.length !== Document.VALID_LENGTH) return false;
    if (Document.allDigitsTheSame(cpf)) return false;
    const digitOne = Document.calculateDigit(cpf, 10);
    const digitTwo = Document.calculateDigit(cpf, 11);
    return Document.extractDigit(cpf) === `${digitOne}${digitTwo}`;
  }

  private static extractOnlyNumbers(cpf: string) {
    return cpf.replace(/\D/g, '');
  }

  private static allDigitsTheSame(cpf: string) {
    const [firstDigit] = cpf;
    return [...cpf].every((digit) => digit === firstDigit);
  }

  private static calculateDigit(cpf: string, factor: number) {
    let total = 0;
    for (const digit of cpf) {
      if (factor > 1) total += parseInt(digit) * factor--;
    }
    const rest = total % 11;
    return rest < 2 ? 0 : 11 - rest;
  }

  private static extractDigit(cpf: string) {
    return cpf.slice(9);
  }
}
