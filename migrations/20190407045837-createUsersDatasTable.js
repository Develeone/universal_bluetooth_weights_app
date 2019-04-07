'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.createTable('users_datas', {
          id: {
              allowNull: false,
              autoIncrement: true,
              primaryKey: true,
              type: Sequelize.INTEGER
          },
          user_id: {
              type: Sequelize.INTEGER,
              references: {
                  model: 'users',
                  key: 'id'
              },
              onUpdate: 'cascade',
              onDelete: 'cascade'
          },
          weight: {
              type: Sequelize.INTEGER
          },
          height: {
              type: Sequelize.INTEGER
          },
          resistance: {
              type: Sequelize.INTEGER
          },
          createdAt: {
              allowNull: false,
              type: Sequelize.DATE,
              defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
          },
          updatedAt: {
              allowNull: false,
              type: Sequelize.DATE,
              defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
          }
      });
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.dropTable('users_datas');
  }
};
