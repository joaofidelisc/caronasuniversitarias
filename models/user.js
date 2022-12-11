'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Veiculo);
    }
  }
  User.init({
    userId: DataTypes.STRING,
    nome: DataTypes.STRING,
    CPF: DataTypes.STRING,
    dataNasc: DataTypes.DATE,
    email: DataTypes.STRING,
    numCel: DataTypes.STRING,
    token: DataTypes.STRING,
    universidade: DataTypes.STRING,
    classificacao: DataTypes.FLOAT,
    fotoPerfil: DataTypes.STRING,
    motorista: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};