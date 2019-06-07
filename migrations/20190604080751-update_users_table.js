'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.addColumn('users', 'training_goals_type_id', {
          type: Sequelize.INTEGER,
          references: {
              model: 'training_goals_types',
              key: 'id',
              allowNull: true,
              defaultValue: 1,
          },
          onUpdate: 'cascade',
          onDelete: 'cascade'
      })
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.removeColumn('users', 'training_goals_type_type_id');
  }
};
