import { Request, Response } from 'express';

import { getUsers, createUserWithProfile } from '../models/userModel';
import { catchErrorHelper } from './controllerHelpers';

export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await getUsers();
    res.status(200).json(users);
  } catch (err) {
    catchErrorHelper(err, res)
  }
};

export const addUser = async (req: Request, res: Response) => {
  try {
    const { email, passwordHash, firstName, lastName, bio } = req.body;
    const newUser = await createUserWithProfile(email, passwordHash, firstName, lastName, bio);
    res.status(201).json(newUser);
  } catch (err) {
    catchErrorHelper(err, res)
  }
};
