import Sequelize from 'sequelize';

export default class Ingredient extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        name: {
          type: Sequelize.DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        isChecked: {
          type: Sequelize.DataTypes.BOOLEAN,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: 'Ingredient',
        tableName: 'ingredients',
        paranoid: false,
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
      }
    );
  }

  static associate(db) {
    db.Ingredient.belongsToMany(db.Recipe, { through: 'RecipeIngredient' });
  }
}
