import dotenv from 'dotenv';
import { config } from '../config/config.js';
dotenv.config();
module.exports = {
  development: {
    username: 'root',
    password: '5w]oto6PG.1',
    database: 'myrecipenote',
    host: config.db.host,
    dialect: 'mysql',
  },
  test: {
    username: 'root',
    password: null,
    database: 'database_test',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
  production: {
    username: 'root',
    password: null,
    database: 'database_production',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
};
