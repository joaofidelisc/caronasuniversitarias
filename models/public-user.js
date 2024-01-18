'use strict';
const {
  Model
} = require('sequelize');


module.exports = (sequelize, DataTypes) => {
  class PublicUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PublicUser.hasMany(models.Veiculo, {foreignKey: 'userId'});
      PublicUser.hasMany(models.PassageiroViagem, {foreignKey: 'userId'});
    }
  }
  PublicUser.init({
    // id: DataTypes.STRING(50),
    nome: DataTypes.STRING(100),
    email: DataTypes.STRING(100),
    universidade: DataTypes.STRING(100),
    classificacao: DataTypes.FLOAT,
    fotoPerfil: DataTypes.STRING,
    motorista: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'PublicUser',
    tableName: 'public_users'
  });
  return PublicUser;
};