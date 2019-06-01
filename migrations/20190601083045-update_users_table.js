'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.addColumn('users', 'activity_type_id', {
          type: Sequelize.INTEGER,
          references: {
              model: 'activity_types',
              key: 'id',
              allowNull: true,
              defaultValue: 2,
          },
          onUpdate: 'cascade',
          onDelete: 'cascade'
      })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('users', 'activity_type_id');
  }
};
