import 'dotenv/config';
import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT ?? '3306', 10) || 3306,
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'pass',
  database: process.env.DB_DATABASE || 'technest_db',
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
});
