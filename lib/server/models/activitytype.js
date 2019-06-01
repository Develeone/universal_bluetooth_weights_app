const database = require('../database');

module.exports = {

    ActivityType: database.sequelize.define('activity_types', {
            name: {
                type: database.Sequelize.STRING,
            },
            coefficient: {
                type: database.Sequelize.FLOAT,
            }
        },
        {
            timestamps: false
        }),
};