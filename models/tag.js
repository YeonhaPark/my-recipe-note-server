import Sequelize from 'sequelize';

export default class Tag extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        title: {
          type: Sequelize.DataTypes.STRING(12),
          unique: true,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: 'Tag',
        tableName: 'tags',
        paranoid: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      }
    );
  }

  static associate(db) {
    db.Tag.belongsToMany(db.Recipe, { through: 'RecipeTag' });
  }
}
