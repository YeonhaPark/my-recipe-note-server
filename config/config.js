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
    username: 'zncztflwtherwt',
    password:
      '44ff7ba31c8c0ba122af5d3a8252694a813110c9c7b5d609306a0d9018b7ee92',
    database: 'd311kv3ucu85r6',
    host: 'ec2-3-209-42-36.compute-1.amazonaws.com',
    dialect: 'postgres',
  },
};
