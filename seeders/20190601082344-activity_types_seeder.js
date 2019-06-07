'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('activity_types', [{
          name: 'Минимальные нагрузки (сидячая работа)',
          coefficient: 1.2,
      },
      {
          name: 'Необременительные тренировки 3 раза в неделю',
          coefficient: 1.375,
      },
      {
          name: 'Тренировки 5 раз в неделю (работа средней тяжести)',
          coefficient: 1.4625,
      },
      {
          name: 'Интенсивные тренировки 5 раз в неделю',
          coefficient: 1.550,
      },
      {
          name: 'Ежедневные тренировки',
          coefficient: 1.6375,
      },
      {
          name: 'Ежедневные интенсивные тренировки или занятия 2 раза в день',
          coefficient: 1.725,
      },
      {
          name: 'Тяжелая физическая работа или интенсивные тренировки 2 раза в день',
          coefficient: 1.9,
      }
      ], {});
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('activity_types', null, {});
  }
};
