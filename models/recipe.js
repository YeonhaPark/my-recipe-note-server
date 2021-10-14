import Sequelize from 'sequelize';
export default class Recipe extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        title: {
          type: Sequelize.DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        contents: {
          type: Sequelize.DataTypes.TEXT,
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: 'Recipe',
        tableName: 'recipes',
        paranoid: false,
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
      }
    );
  }

  static associate(db) {
    db.Recipe.belongsTo(db.User);
    db.Recipe.belongsToMany(db.Ingredient, {
      as: 'ingredients',
      through: 'RecipeIngredient',
    });
    db.Recipe.belongsToMany(db.Tag, { as: 'tags', through: 'RecipeTag' });
  }
}
