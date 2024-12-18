import { Request, Response } from 'express';
import { dropUsersTable } from '../models/dbModel';


export const runDbReset = async (_req: Request, res: Response) => {
  try {
    const result = await dropUsersTable();
    res.status(200).json(result);
  } catch (err) {
    if (err instanceof Error) {
        res.status(500).json({ error: err.message});
    }
    else {
        res.status(500).json({ error: 'Internal Server Error'});
    }
  }
};

