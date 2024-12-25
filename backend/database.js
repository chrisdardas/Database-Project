import sql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const db = await sql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE
});

export default db;