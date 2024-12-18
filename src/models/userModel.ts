import pool from '../config/db';
import { ResultSetHeader } from 'mysql2';

export const getUsers = async () => {
  const [rows] = await pool.query(`
    SELECT 
      users.id AS userId, 
      users.email, 
      users.created_at AS userCreatedAt,
      users.updated_at AS userUpdatedAt,
      profiles.id AS profileId,
      profiles.first_name AS firstName,
      profiles.last_name AS lastName,
      profiles.date_of_birth AS dateOfBirth,
      profiles.bio,
      profiles.profile_picture_url AS profilePictureUrl,
      profiles.created_at AS profileCreatedAt,
      profiles.updated_at AS profileUpdatedAt
    FROM users
    LEFT JOIN profiles ON users.id = profiles.user_id
  `);
  return rows;
};

export const createUserWithProfile = async (
  email: string,
  passwordHash: string,
  firstName: string,
  lastName: string,
  bio: string,
) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [userResult] = await connection.query<ResultSetHeader>(
      'INSERT INTO users (email, password_hash) VALUES (?, ?)',
      [email, passwordHash]
    );

    const userId = userResult.insertId;

    await connection.query(
      'INSERT INTO profiles (user_id, first_name, last_name, bio) VALUES (?, ?, ?, ?)',
      [userId, firstName, lastName, bio]
    );

    await connection.commit();
    return { userId, email, firstName, lastName };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};
