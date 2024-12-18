import pool from '../config/db';
import { ResultSetHeader } from 'mysql2';

export const getUsers = async () => {
  const [rows] = await pool.query('SELECT * FROM users');
  return rows;
};

export const createUser = async (name: string, email: string) => {
  const [result] = await pool.query<ResultSetHeader>(
    'INSERT INTO users (name, email) VALUES (?, ?)',
    [name, email]
  );
  return result;
};
