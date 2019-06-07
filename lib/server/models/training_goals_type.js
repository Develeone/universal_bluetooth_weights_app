const database = require('../database');

module.exports = {

    TrainingGoalsType: database.sequelize.define('training_goals_types', {
            name: {
                type: database.Sequelize.STRING,
            },
        },
        {
            timestamps: false
        }),


    getAllTypes: function(cb) {
        return this.TrainingGoalsType.findAll({
        }).then((result) => {
            cb(result);
        });
    },

    getType: function(id, cb) {
        return this.TrainingGoalsType.findByPk(id).
        then((result) => {
            cb(result);
        });
    },

};