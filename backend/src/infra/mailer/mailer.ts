export async function sendEmail(
  recipient: string,
  subject: string,
  message: string,
) {
  console.log(
    `Enviando email para ${recipient} com o assunto "${subject}" e a mensagem: ${message}`,
  );
  return true;
}
