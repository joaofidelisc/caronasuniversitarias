'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PassageiroViagem', {
      id:{
        allowNull: false,
        type: Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true,
      },
      userId: {
        allowNull:false,
        type: Sequelize.STRING(50),
        // primaryKey: true,
        autoIncrement: false,
        references:{
          model:'user',
          key:'id'
        },
        onUpdate: 'NO ACTION',
        onDelete: 'NO ACTION'
      },
      idViagem: {
        type: Sequelize.INTEGER,
        // primaryKey: true,
        autoIncrement: false,
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
