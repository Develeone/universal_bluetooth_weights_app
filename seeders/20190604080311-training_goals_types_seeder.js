'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('training_goals_types', [{
              name: 'Похудеть на 1 кг',
          },
          {
              name: 'Похудеть на 2 кг',
          },
          {
              name: 'Похудеть на 2 кг',
          },
          {
              name: 'Похудеть на 3 кг',
          },
          {
              name: 'Похудеть на 5 кг',
          },
          {
              name: 'Набрать массу: +1 кг',
          },
          {
              name: 'Набрать массу: +3 кг',
          },

      ], {});
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('activity_types', null, {});
  }
};
