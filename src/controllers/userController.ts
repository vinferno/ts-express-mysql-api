import { Request, Response } from 'express';
import { getUsers, createUser } from '../models/userModel';

export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await getUsers();
    res.status(200).json(users);
  } catch (err) {
    if (err instanceof Error) {
        res.status(500).json({ error: err.message});
    }
    else {
        res.status(500).json({ error: 'Internal Server Error'});
    }
  }
};

export const addUser = async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;
    const result = await createUser(name, email);
    res.status(201).json({ id: result.insertId, name, email });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
