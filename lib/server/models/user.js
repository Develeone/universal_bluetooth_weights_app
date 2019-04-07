const database = require('../database');

module.exports = {

    User: database.sequelize.define('User', {
            name: {
                type: database.Sequelize.STRING,
            },
            age_date: {
                type: database.Sequelize.DATEONLY,
            },
            height: {
                type: database.Sequelize.INTEGER,
            }
        },
        {
            timestamps: false
        }),

    getUser: function (userId) {

        var current_date = new Date();

        this.User.findByPk(userId).then(user => {

            var age_date = new Date(user.age_date);

            user.dataValues.age = this.diffYears(current_date, age_date);

            console.log(JSON.stringify(user));
        });
    },

    diffYears: function (dt2, dt1)
    {

        var diff =(dt2.getTime() - dt1.getTime()) / 1000;
        diff /= (60 * 60 * 24);
        return Math.abs(Math.round(diff/365.25)-1);

    }
};