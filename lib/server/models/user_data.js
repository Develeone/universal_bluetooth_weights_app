const database = require('../database');
const request = require('request');

module.exports = {

    UserData: database.sequelize.define('users_datas', {
            user_id: {
                type: database.Sequelize.INTEGER,
            },
            weight: {
                type: database.Sequelize.INTEGER,
            },
            height: {
                type: database.Sequelize.INTEGER,
            },
            resistance: {
                type: database.Sequelize.INTEGER,
            },
        }),

    getAllUserDatas: function(userId, cb) {

        return this.UserData.findAll(
            {
                where: {
                    user_id: userId
                }
            }).then((result) => {
                cb(result);
            });
    },

    createUserData: function(userId, weight, resistance) {
        this.UserData.create(
            {
                user_id: userId,
                weight:weight,
                resistance: resistance
            })
            .then(() => {
                console.log(
                    "created"
                );
            });

        //TODO заменить на правильный хост
        request('https://webhook.site/f34e3936-1c6d-447b-b7c2-320206f728ab', function (error, response, body) {
            console.log('error:', error);
            console.log('statusCode:', response && response.statusCode);
        });
    }
};
