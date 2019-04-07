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
        this.UserData.findAll(
            {
                where: {
                    user_id: userId
                }
            })
            .then(users_datas => {
                console.log("All users:", JSON.stringify(users_datas, null, 4));
            });
    }
};
