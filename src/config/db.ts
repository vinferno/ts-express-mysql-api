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
    connection.release(); // Release the connection back to the pool
  } catch (error) {
    if (error instanceof Error) {
      console.error('❌ Unable to connect to the database:', error.message);
    } else {
      console.error('❌ Unable to connect to the database:', error);
    }
    process.exit(1); // Exit the application if the connection fails
  }
})();

export default pool;
