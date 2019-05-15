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

        request('http://134.209.192.204/add/weighing');
    }
};
