const database = require('../database');
const request = require('request');
const user = require('./user');

const AUTO_RECORDING_PREVIOUS_RESULTS_COUNT = 93;

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
        return this.UserData.findAll({
                where: {user_id: userId}
            }).then((result) => {
			    cb(result);
		});
    },

    createUserData: function(userId, weight, resistance) {
        var res = this.UserData.create({
            user_id: userId,
            weight: weight,
            resistance: resistance
        });
        
        try {
            request('http://134.209.192.204/add/weighing');

            //Добавление в статистику счестчика уникальных взвешиваний
            this.addUniqueUserCount(userId);
        }
        catch (e) {}

        return res;
    },

    addUniqueUserCount: function(userId) {
        let date = new Date();
        date.setHours(12, 0,0,0);

        return this.UserData.findOne(
            {
                order:
                    [["createdAt", "DESC"]],
                where: {
                    user_id: userId,
                    createdAt: {
                        [database.Sequelize.Op.gt]: date,
                    }
                }
            }).then(user_data => {

                if (user_data)
                    throw new Error();
                else
                    return user.User.findOne({
                            where: {
                                id: userId
                        }
                    });

            })
            .then(user => {
                if (user.dataValues.is_male)
                    request('http://134.209.192.204/add/man');
                else
                    request('http://134.209.192.204/add/woman');

                return "Новое урникальное взвешивание добавлено";
                //пишем в бд DO пол взвешивания
            }).catch(err => {
                console.log('Уже был взвешен');
            });
    },
};
