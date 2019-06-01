'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.changeColumn('users_datas', 'weight', {
          type: Sequelize.FLOAT,
      })
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.changeColumn('users_datas', 'weight', {
          type: Sequelize.INTEGER,
      })
  }
};
