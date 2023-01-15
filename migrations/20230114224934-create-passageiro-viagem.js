'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PassageiroViagem', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        allowNull:false,
        type: Sequelize.STRING(50),
        references:{
          model:'user',
          key:'id'
        },
        onUpdate: 'NO ACTION',
        onDelete: 'NO ACTION'
      },
      idViagem: {
        type: Sequelize.INTEGER,
        references:{
          model:'viagem',
          key:'idViagem'
        },
        onUpdate: 'NO ACTION',
        onDelete: 'NO ACTION'
      },
      destino: {
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
    await queryInterface.dropTable('PassageiroViagem');
  }
};