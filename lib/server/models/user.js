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
            },
            is_male: {
                type: database.Sequelize.BOOLEAN,
            },
            phone_number: {
                type: database.Sequelize.STRING,
            }
        },
        {
            timestamps: false
        }),

    createUser: function (name, age_date, height, is_male, phone_number) {
        this.User.create(
            {
                name: name,
                age_date: age_date,
                height: height,
                is_male: is_male,
                phone_number: phone_number,
            })
            .then(() => {
                console.log(
                    "created"
                );
            });
    },

    getUser: function (userId) {

        var current_date = new Date();

        this.User.findByPk(userId).then(user => {

            var age_date = new Date(user.age_date);

            user.dataValues.age = this.diffYears(current_date, age_date);

            console.log(JSON.stringify(user, null, 4));
        });
    },

    diffYears: function (dt2, dt1)
    {

        var diff =(dt2.getTime() - dt1.getTime()) / 1000;
        diff /= (60 * 60 * 24);
        return Math.abs(Math.round(diff/365.25)-1);

    }
};