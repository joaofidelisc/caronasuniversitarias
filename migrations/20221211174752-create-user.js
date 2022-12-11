'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      userId: {
        allowNull: false,
        // autoIncrement: true,
        primaryKey: true,
        type: Sequelize.STRING
      },
      nome: {
        type: Sequelize.STRING
      },
      CPF: {
        type: Sequelize.STRING
      },
      dataNasc: {
        type: Sequelize.DATE
      },
      email: {
        type: Sequelize.STRING
      },
      numCel: {
        type: Sequelize.STRING
      },
      token: {
        type: Sequelize.STRING
      },
      universidade: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('Users');
  }
};