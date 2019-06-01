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


    getAllTypes: function(cb) {
        return this.ActivityType.findAll({
            }).then((result) => {
                cb(result);
            });
    },

    getType: function(id, cb) {
        return this.ActivityType.findByPk(id).
            then((result) => {
            cb(result);
        });
    },

};