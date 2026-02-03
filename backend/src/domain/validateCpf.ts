const VALID_LENGTH = 11;

export function validateCpf(cpf: string) {
  if (!cpf) return false;
  cpf = extractOnlyNumbers(cpf);
  if (cpf.length !== VALID_LENGTH) return false;
  if (allDigitsTheSame(cpf)) return false;
  const digitOne = calculateDigit(cpf, 10);
  const digitTwo = calculateDigit(cpf, 11);
  return extractDigits(cpf) === `${digitOne}${digitTwo}`;
}

function extractOnlyNumbers(cpf: string) {
  return cpf.replace(/\D/g, '');
}

function allDigitsTheSame(cpf: string) {
  const [firstDigit] = cpf;
  return [...cpf].every((digit) => digit === firstDigit);
}

function calculateDigit(cpf: string, factor: number) {
  let total = 0;
  for (const digit of cpf) {
    if (factor > 1) total += parseInt(digit) * factor--;
  }
  const rest = total % 11;
  return rest < 2 ? 0 : 11 - rest;
}

function extractDigits(cpf: string) {
  return cpf.slice(9);
}
