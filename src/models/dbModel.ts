import { query } from "express";
import pool from "../config/db";
import { ResultSetHeader, ProcedureCallPacket } from "mysql2";

export const dropUsersTable = async () => {
    /** ResultSetHeader */
    pool.query("DROP PROCEDURE IF EXISTS dropProcedure");

    /** ResultSetHeader */
    pool.query(`
    CREATE PROCEDURE dropProcedure()
    BEGIN
        SET FOREIGN_KEY_CHECKS = 0;
        drop table if exists users;
        drop table if exists profiles;
        SET FOREIGN_KEY_CHECKS = 1;

        CREATE TABLE users (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) NOT NULL UNIQUE,
            password_hash VARCHAR(255) NOT NULL,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE profiles (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            user_id BIGINT UNSIGNED NOT NULL,
            first_name VARCHAR(100),
            last_name VARCHAR(100),
            date_of_birth DATE,
            bio TEXT,
            profile_picture_url VARCHAR(2083),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
        CREATE UNIQUE INDEX idx_users_email ON users(email);
        CREATE INDEX idx_profiles_user_id ON profiles(user_id);
    END
  `);

    /** ProcedureCallPacket */
    const sql = "CALL dropProcedure()";

    const result = pool.query<ProcedureCallPacket<ResultSetHeader>>(sql);
    return result;
};
