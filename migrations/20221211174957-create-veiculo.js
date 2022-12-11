'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Veiculos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nomeVeiculo: {
        type: Sequelize.STRING
      },
      anoVeiculo: {
        type: Sequelize.INTEGER
      },
      corVeiculo: {
        type: Sequelize.STRING
      },
      placaVeiculo: {
        type: Sequelize.STRING
      },
      userId: {
        type: Sequelize.STRING,
        references:{
          model:'users',
          key:'userId'
        },
        onUpdate:'cascade',
        onDelete: 'cascade' //quando apagar um usuario, apaga os veiculos junto
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
    await queryInterface.dropTable('Veiculos');
  }
};