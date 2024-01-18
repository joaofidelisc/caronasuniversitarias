'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Public_users', {
      id: {
        allowNull: false,
        autoIncrement:false,
        primaryKey: true,
        defaultValue: '',
        type: Sequelize.STRING(50),
      },
      nome: {
        type: Sequelize.STRING(100)
      },
      email: {
        type: Sequelize.STRING(100)
      },
      universidade: {
        type: Sequelize.STRING(100)
      },
      classificacao: {
        type: Sequelize.FLOAT
      },
      fotoPerfil: {
        type: Sequelize.STRING
      },
      motorista: {
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Public_users');
  }
};