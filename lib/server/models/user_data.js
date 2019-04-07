const database = require('../database');

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
            date: {
                type: database.Sequelize.DATE,
            },
        },
        {
            timestamps: false
        }),

    getAllUserDatas: function(userId) {

        return this.UserData.findAll(
            {
                where: {
                    user_id: userId
                }
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
    }
};
