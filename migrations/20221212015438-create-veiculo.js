'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Veiculo', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        // defaultValue: Math.random().toString(),
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.STRING(50),
        references:{
          model: 'user',
          key:'id'
        },
        onUpdate: 'NO ACTION',
        onDelete: 'NO ACTION'
      },
      nomeVeiculo: {
        type: Sequelize.STRING(100)
      },
      anoVeiculo: {
        type: Sequelize.INTEGER
      },
      corVeiculo: {
        type: Sequelize.STRING(15)
      },
      placaVeiculo: {
        type: Sequelize.STRING(7)
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
    await queryInterface.dropTable('Veiculo');
  }
};