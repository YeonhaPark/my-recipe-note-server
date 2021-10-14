import { sequelize } from '../db/database.js';
import db from '../models/index.js';
import SQ from 'sequelize';

// const DataTypes = SQ.DataTypes;
const { User } = db;
// export const User = sequelize.define(
//   'user',
//   {
//     id: {
//       type: DataTypes.INTEGER,
//       autoIncrement: true,
//       allowNull: false,
//       primaryKey: true,
//     },
//     username: {
//       type: DataTypes.STRING(128),
//       allowNull: false,
//     },
//     password: {
//       type: DataTypes.STRING(128),
//       allowNull: false,
//     },
//   },
//   { timestamps: false }
// );

export async function findByUsername(username) {
  return User.findOne({ where: { username } });
}

export async function createUser(user) {
  return User.create(user).then((data) => {
    return data.dataValues.id;
  });
}

export async function findById(id) {
  return User.findByPk(id);
}
