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
    // id: DataTypes.STRING(50),
    nome: DataTypes.STRING(100),
    CPF: DataTypes.STRING(14),
    dataNasc: DataTypes.DATE,
    email: DataTypes.STRING(100),
    numCel: DataTypes.STRING(18),
    token: DataTypes.STRING,
    universidade: DataTypes.STRING(100),
    classificacao: DataTypes.FLOAT,
    fotoPerfil: DataTypes.STRING,
    motorista: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'user'
  });
  return User;
};