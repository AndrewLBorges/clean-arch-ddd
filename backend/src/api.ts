import express, { Request, Response } from 'express';
import cors from 'cors';
import AccountService from './AccountService';
import { AccountDAODatabase } from './AccountDAO';

async function main() {
  const app = express();
  app.use(cors());
  app.use(express.json());
  const accountDao = new AccountDAODatabase();
  const accountService = new AccountService(accountDao);

  app.post('/signup', async (req: Request, res: Response) => {
    try {
      const input = req.body;
      const output = await accountService.signup(input);
      res.json(output);
    } catch (error: any) {
      res.status(422).json({ message: error.message });
    }
  });

  app.get('/accounts/:accountId', async (req: Request, res: Response) => {
    const accountId = req.params.accountId as string;
    const output = await accountService.getAccount(accountId);
    res.json(output);
  });

  app.listen(3000);
}

main();
