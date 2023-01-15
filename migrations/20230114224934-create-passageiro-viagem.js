'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PassageiroViagem', {
      userId: {
        allowNull:false,
        type: Sequelize.STRING(50),
        // primaryKey: true,
        autoIncrement: false,
        references:{
          model:'user',
          key:'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      idViagem: {
        type: Sequelize.INTEGER,
        // primaryKey: true,
        autoIncrement: false,
        references:{
          model:'viagem',
          key:'idViagem'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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
    await queryInterface.addConstraint('PassageiroViagem', {
      fields: ['userId', 'idViagem'],
      type: 'primary key',
      name: 'refPassageiroViagem'
  });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('PassageiroViagem');
  }
};
