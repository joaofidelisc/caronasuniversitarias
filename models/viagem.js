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
      Viagem.belongsTo(models.User);
    }
  }
  Viagem.init({
    nomeMotorista: DataTypes.STRING(100),
    uidPassageiro1: DataTypes.STRING(50),
    uidPassageiro2: DataTypes.STRING(50),
    uidPassageiro3: DataTypes.STRING(50),
    uidPassageiro4: DataTypes.STRING(50),
    uidMotorista: DataTypes.STRING(50),
    fotoPerfilMotorista: DataTypes.STRING,
    UserId: DataTypes.STRING(50),
    destino: DataTypes.STRING,
    dataViagem: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Viagem',
    tableName: 'Viagem'
  });
  return Viagem;
};