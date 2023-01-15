'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Viagem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Viagem.belongsTo(models.PassageiroViagem, {foreignKey: 'idViagem'});
    }
  }
  Viagem.init({
    uidMotorista: DataTypes.STRING,
    dataViagem: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Viagem',
    tableName: 'viagem'
  });
  Viagem.removeAttribute('id');
  return Viagem;
};