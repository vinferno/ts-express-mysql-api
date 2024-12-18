# TypeScript Express MySQL API

This repository contains a production-level API built using TypeScript, Express.js, and MySQL. Below is a detailed explanation of each file, its purpose, and what happens when it is executed.

---

## Project Structure
```
ts-express-mysql-api/
├── src/
│   ├── config/
│   │   └── db.ts
│   ├── controllers/
│   │   └── userController.ts
│   ├── routes/
│   │   └── userRoutes.ts
│   ├── models/
│   │   └── userModel.ts
│   ├── index.ts
├── .env
├── package.json
├── tsconfig.json
```

---

## File Descriptions

### `src/index.ts`
#### Purpose
- The entry point for the application.
- Sets up the Express server and configures routing.

#### What Happens When Run
1. **Environment Variables Loaded**: The `dotenv` package loads configuration from `.env`.
2. **Express App Initialization**: The Express app is created and middleware (e.g., `express.json`) is set up.
3. **Routes Mounted**: The `/api/users` route is attached to the application, using `userRoutes`.
4. **Server Start**: The app listens for incoming requests on the specified port (from `.env` or default `3000`).

#### Code Snippet
```typescript
import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/users', userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
```

---

### `src/config/db.ts`
#### Purpose
- Handles database connection setup and testing.
- Creates a connection pool using `mysql2/promise`.

#### What Happens When Run
1. **Connection Pool Created**: A pool of reusable MySQL connections is established using the database credentials from `.env`.
2. **Connection Test**: Attempts to connect to the database.
   - Logs `✅ Database connection established successfully` on success.
   - Logs `❌ Unable to connect to the database: [error]` on failure and exits the application.

#### Code Snippet
```typescript
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connection established successfully');
    connection.release();
  } catch (error) {
    if (error instanceof Error) {
      console.error('❌ Unable to connect to the database:', error.message);
    } else {
      console.error('❌ Unable to connect to the database:', error);
    }
    process.exit(1);
  }
})();

export default pool;
```

---

### `src/models/userModel.ts`
#### Purpose
- Contains database queries for the `users` and `profiles` tables.
- Acts as the data access layer.

#### What Happens When Run
1. Executes SQL queries using the database connection pool.
2. For `getUsers`, retrieves all records from the `users` table.
3. For `createUserWithProfile`, inserts a new user and profile in a single transaction.

#### Code Snippet
```typescript
import pool from '../config/db';
import { ResultSetHeader } from 'mysql2';

export const getUsers = async () => {
  const [rows] = await pool.query('SELECT * FROM users');
  return rows;
};

export const createUserWithProfile = async (
  email: string,
  passwordHash: string,
  firstName: string,
  lastName: string
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
      'INSERT INTO profiles (user_id, first_name, last_name) VALUES (?, ?, ?)',
      [userId, firstName, lastName]
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
```

---

### `src/controllers/userController.ts`
#### Purpose
- Handles HTTP requests and responses for user-related operations.
- Calls the corresponding model functions.

#### What Happens When Run
1. For `getAllUsers`, fetches all users by calling `getUsers` from `userModel` and responds with the data.
2. For `addUser`, validates the request body, calls `createUserWithProfile` from `userModel`, and responds with the newly created user’s details.

#### Code Snippet
```typescript
import { Request, Response } from 'express';
import { getUsers, createUserWithProfile } from '../models/userModel';

export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await getUsers();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const addUser = async (req: Request, res: Response) => {
  try {
    const { email, passwordHash, firstName, lastName } = req.body;
    const newUser = await createUserWithProfile(email, passwordHash, firstName, lastName);
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
```

---

### `src/routes/userRoutes.ts`
#### Purpose
- Defines the routing logic for user-related endpoints.
- Connects the route paths to their respective controller functions.

#### What Happens When Run
1. The `router` instance is created using `express.Router()`.
2. `GET /` maps to `getAllUsers`.
3. `POST /` maps to `addUser`.

#### Code Snippet
```typescript
import express from 'express';
import { getAllUsers, addUser } from '../controllers/userController';

const router = express.Router();

router.get('/', getAllUsers);
router.post('/', addUser);

export default router;
```

---

### `.env`
#### Purpose
- Stores sensitive configuration such as database credentials and the port number.

#### Example
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=yourdatabase
PORT=3000
```

---

## Running the Application

### Development
1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npx ts-node-dev src/index.ts
   ```

### Production
1. Compile the TypeScript code:
   ```bash
   npx tsc
   ```

2. Run the compiled JavaScript code:
   ```bash
   node dist/index.js
   ```

---

## Testing Database Connection
- On startup, the app attempts to connect to the database.
- Success:
  ```
  ✅ Database connection established successfully
  ```
- Failure:
  ```
  ❌ Unable to connect to the database: [error]
  ```

