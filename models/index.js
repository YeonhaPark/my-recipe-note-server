import Sequelize from 'sequelize';
import { config } from '../config.js';
import User from './user.js';
import Recipe from './recipe.js';
import Tag from './tag.js';
import Ingredient from './ingredient.js';

const db = {};

const sequelize = new Sequelize(
  config.db.database,
  config.db.user,
  config.db.password,
  {
    host: config.db.host,
    port: config.db.port,
    dialect: process.env.NODE_ENV === 'development' ? 'mysql' : 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  }
);
db.sequelize = sequelize;
db.User = User;
db.Recipe = Recipe;
db.Tag = Tag;
db.Ingredient = Ingredient;

User.init(sequelize);
Recipe.init(sequelize);
Tag.init(sequelize);
Ingredient.init(sequelize);

User.associate(db);
Recipe.associate(db);
Tag.associate(db);
Ingredient.associate(db);

export default db;
