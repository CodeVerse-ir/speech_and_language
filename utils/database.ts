import { createPool, Pool } from "mysql2/promise";

class Database {
  private static instance: Database;
  private pool: Pool;

  private constructor() {
    this.pool = createPool({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async query(sql: string, params?: any[]): Promise<any> {
    const connection = await this.pool.getConnection();
    try {
      const [results] = await connection.query(sql, params);
      return results;
    } finally {
      connection.release();
    }
  }

  // سایر متدهای مورد نیاز...
}

const db = Database.getInstance();
export default db;
