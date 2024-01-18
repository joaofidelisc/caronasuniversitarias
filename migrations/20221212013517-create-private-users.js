'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Private_users', {
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
      CPF: {
        type: Sequelize.STRING(14)
      },
      dataNasc: {
        type: Sequelize.DATE
      },
      email: {
        type: Sequelize.STRING(100)
      },
      numCel: {
        type: Sequelize.STRING(18)
      },
      token: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('Private_users');
  }
};