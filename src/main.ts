import express, { Request, Response } from 'express';
import pgp from 'pg-promise';

async function main() {
  const app = express();
  app.use(express.json());

  const connection = pgp()('postgres://postgres:123456@localhost:5432/app');
  console.log(connection);

  app.post('/signup', async (req: Request, res: Response) => {
    const accountId = crypto.randomUUID();
    const account = {
      accountId,
      name: req.body.name,
      email: req.body.email,
      document: req.body.document,
      password: req.body.password,
    };
    await connection.query(
      'INSERT INTO ccca.account(account_id, name, email, document, password) VALUES($1, $2, $3, $4, $5)',
      [
        accountId,
        account.name,
        account.email,
        account.document,
        account.password,
      ]
    );
    res.json({ accountId });
  });

  app.get('/accounts/:accountId', async (req: Request, res: Response) => {
    const [account] = await connection.query(
      'SELECT * FROM ccca.account WHERE account_id = $1',
      [req.params.accountId]
    );
    res.json(account);
  });

  app.listen(3000);
}

main();
