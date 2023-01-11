'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Viagem', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nomeMotorista: {
        type: Sequelize.STRING(100)
      },
      uidPassageiro1: {
        allowNull: true,
        type: Sequelize.STRING(50),
        references:{
          model: 'user',
          key: 'id'
        },
        onUpdate: 'NO ACTION',
        onDelete: 'NO ACTION'
      },
      uidPassageiro2: {
        allowNull: true,
        type: Sequelize.STRING(50),
        references:{
          model: 'user',
          key: 'id'
        },
        onUpdate: 'NO ACTION',
        onDelete: 'NO ACTION'
      },
      uidPassageiro3: {
        allowNull: true,
        type: Sequelize.STRING(50),
        references:{
          model: 'user',
          key: 'id'
        },
        onUpdate: 'NO ACTION',
        onDelete: 'NO ACTION'
      },
      uidPassageiro4: {
        allowNull: true,
        type: Sequelize.STRING(50),
        references:{
          model: 'user',
          key: 'id'
        },
        onUpdate: 'NO ACTION',
        onDelete: 'NO ACTION'
      },
      uidMotorista: {
        allowNull: true,
        type: Sequelize.STRING(50),
        references:{
          model: 'user',
          key: 'id'
        },
        onUpdate: 'NO ACTION',
        onDelete: 'NO ACTION'
      },
      fotoPerfilMotorista: {
        type: Sequelize.STRING
      },
      destino: {
        type: Sequelize.STRING
      },
      dataViagem: {
        type: Sequelize.DATE
      },
      UserId: {
        allowNull:true,
        type: Sequelize.STRING(50)
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
    await queryInterface.dropTable('Viagem');
  }
};