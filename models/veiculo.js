'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Veiculo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Veiculo.belongsTo(models.PublicUser, {foreignKey: 'userId'});
    }
  }
  Veiculo.init({
    userId: DataTypes.STRING(50),
    nomeVeiculo: DataTypes.STRING(100),
    anoVeiculo: DataTypes.INTEGER,
    corVeiculo: DataTypes.STRING(15),
    placaVeiculo: DataTypes.STRING(7)
  }, {
    sequelize,
    modelName: 'Veiculo',
    tableName: 'veiculo'
  });
  return Veiculo;
};

