'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PassageiroViagem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PassageiroViagem.belongsTo(models.User, {foreignKey: 'userId'});
      
      //Revisar aqui!
      // PassageiroViagem.hasOne(models.Viagem, {foreignKey:'idViagem'});
    }
  }
  PassageiroViagem.init({
    userId: DataTypes.STRING(50),
    idViagem: DataTypes.INTEGER,
    destino: DataTypes.STRING,
    // uidPassageiroIdViagem: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'PassageiroViagem',
    tableName: 'passageiroviagem'
  });
  // PassageiroViagem.removeAttribute('id');
  return PassageiroViagem;
};